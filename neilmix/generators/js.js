(function() {

	/* --- "globals" --- */
	
	function constant(name) { 
		return { 
			toString: function() { 
				return name; 
			} 
		} 
	}
	var NEW = constant("NEW"), 
		SCRIPT_END = constant("SCRIPT_END"), 
		RETURN = constant("RETURN"), 
		YIELD = constant("YIELD");


	function interr(reason) {
		err("Internal error: " + reason);
	}
	
	function err(reason) {
		throw new Error(reason);
	}
	
	function each(array, method) {
		for (var i = 0; i < array.length; i++) {
			array[i] = method(array[i]);
		}
		return array;
	}

	function Reference(tok) {
		this.id = tok;
		this.who = null;
	}

	Reference.prototype = {
		constructor: Reference,
		value: function(cx) {
			if (this.who) {
				return this.who[this.id];
			} else {
				return cx.scope.get(this.id);
			}
		},
		define: function(cx, value) {
			if (this.who) {
				return this.who[this.id] = value;
			} else {
				return cx.scope.set(this.id, value);
			}
		},
		toString: function() {
			return this.id;
		}
	}
	
	Reference.get = function(cx, arg) {
		if (typeof(arg) == "object" && arg != null && arg.constructor == Reference) {
			return arg.value(cx);
		} else {
			return arg;
		}
	}
	
	function Scope(parent, vars) {
		this.parent = parent;
		this.vars = vars || {};
	}
	
	Scope.prototype = {
		define: function(name, value) {
			this.vars[name] = value;
		},
		set: function(name, value) {
			if (this.vars.hasOwnProperty(name)) {
				return this.vars[name] = value;
			} else {
				return this.parent.set(name, value);
			}
		},
		get: function(name, value) {
			if (this.vars.hasOwnProperty(name)) {
				return this.vars[name];
			} else {
				return this.parent.get(name);
			}
		},
		delete_: function(name) {
			if (this.vars.hasOwnProperty(name)) {
				return delete this.vars[name];
			} else {
				return this.parent.delete_(name);
			}
		}
	};
	
	StopIteration = { toString: function() { return "[object StopIteration]" } };

	function ExecContext(scope, bytecode) {
		this.bytecode = bytecode;
		this.scope = scope;
		this.stack = [];
	}
	
	ExecContext.prototype = {
		exit: SCRIPT_END,
		retval: this.undefined,
		ptr: 0,
		yieldPtr: 0,
		exec: function(returnLastStatement) {
			return exec(this, returnLastStatement);
		},
		except: function(ex) {
			this.stack.push(ex);
			this.jump(this.catchPtr);
		},
		jump: function(ptr) {
			while (typeof(this.bytecode[ptr]) == "number") {
				ptr = this.bytecode[ptr]; 
			}
			this.ptr = ptr;
		},
		next: function() {
			return this.resume();
		},
		send: function(value) {
			if (this.ptr == 0) err("Can't send to a generator that hasn't been started.");
			return this.resume(value);
		},
		resume: function(value) {
			if (this.yieldPtr == -1) throw StopIteration;
			this.ptr = this.yieldPtr;
			if (this.ptr) this.stack.push(value);
			var rv = this.exec();
			if (this.exit == SCRIPT_END) {
				this.yieldPtr = -1;
				throw StopIteration;
			}
			if (this.exit == RETURN) {
				this.yieldPtr = -1;
				err("Can't return from a generator");
			}
			return rv;
		},
		"throw": function(ex) {
			if (this.catchPtr) {
				this.except(ex);
			} else {
				this.yieldPtr = -1;
				throw ex;
			}
		},
		close: function() {
			// TODO: run finalizers
			this.yieldPtr = -1;
		}
	};

	/* --- operators and precedence --- */
	
	var inops = {};
	var preops = {};
	var postops = {};
	var allops = [];
	
	var precedence = 0;
	function setops(table, ops, rightAssoc) {
		precedence++;
		each(ops, function(op) {
			allops.push(op);
			table[op] = { 
				precedence: precedence, 
				right: rightAssoc, 
				token: op,
				toString: function() { with(this){return [op,token,precedence,right].join(":")} }
			}
		});
	}
	
	function inop()   { setops(inops, arguments); }
	function inopr()  { setops(inops, arguments, true); }
	function preop()  { setops(preops, arguments); }	
	function postop() { setops(postops, arguments); }
	
	// op precedence
	inopr("=","+=","-=","*=","/=","%=","|=","&=","<<=",">>=",">>>=");
	inopr("?",":");
	inop("||");
	inop("&&");
	inop("|");
	inop("^");
	inop("&");
	inop("==","!=","===","!==");
	inop("<","<=",">",">=","in","instanceof");
	inop("<<",">>",">>>");
	inop("+","-");
	inop("*","/","%");
	preop("void","delete","typeof","++","--");
	preop("!","~","+","-");
	postop("++","--");
	preop("new");
	postop("(");
	postop("[");
	inop(".");

	/* --- bytecode execution --- */

	var exec;
	var commands;
	(function() {
		var cx;

		exec = function(paramCx, returnLastStatementOnScriptEnd) {
			// store current context temporarily in case of recursion
			var tmpCx = cx;
			cx = paramCx;
			cx.exit = SCRIPT_END;
			cx.retval = cx.undefined;
			
			try {
				while (cx.ptr >= 0 && cx.ptr < cx.bytecode.length) {
					var command = next();
					if (!commands[command]) interr("invalid bytecode instruction: " + command + ", bytecode: " + cx.bytecode.join(" "));
					if (cx.catchPtr != null) {
						try {
							commands[command]();
						} catch(e) {
							cx.except(e);
						}
					} else {
						commands[command]();
					}
				}
				
				var local_rv = 
					cx.exit != SCRIPT_END
					? cx.retval 
					: returnLastStatementOnScriptEnd ? cx.last : this.undefined;
				
				if (cx.exit != YIELD && cx.stack.length > 0) interr("items remaining on stack");

				return local_rv;
			} finally {
				// restore context
				cx = tmpCx;
			}
		}

		function next()       { return cx.bytecode[cx.ptr++]; }
		function pop()        { cx.stack.length || interr("empty stack"); return cx.stack.pop(); }
		function push(item)   { return cx.stack.push(item); }
		function dup()        { push(top()) }
		function top()        { return cx.stack[cx.stack.length-1] }
		function jump(ptr)    { cx.jump(ptr) }
		function get() {
			return Reference.get(cx, pop());
		}
		
		commands = {
			get:get, pop:pop, dup:dup,
			push: function()    { push(next()); },
			jump: function()    { jump(next()); },
			clear: function()   { cx.last = pop(); },
			pass: function()    { cx.ptr += 1; }, // no-op for storing pointers in bytecode
			// TODO: rename pull?  research.
			pull: function() { 
				var s = cx.stack;
				s.push(s.splice((s.length - 1) - next(), 1)[0]);
			},
			"function": function() {
				var isGenerator = pop();
				var vars = pop();
				var body = pop();
				var args = pop();
				var name = pop();
				
				// reference scope locally because it will be changed by
				// the time this function executes.
				var curScope = cx.scope; 
				var f = function() {
					// create and init child scope
					var newScope = new Scope(curScope, {"this": this});

					newScope.set("arguments", arguments);
					for (var i = 0; i < args.length; i++) {
						newScope.define(args[i], arguments[i]);
					}

					for (var i = 0; i < vars.length; i++) {
						newScope.define(vars[i]);
					}
					var newCx = new ExecContext(newScope, body);
					newScope.define("__CX__", newCx);
					return isGenerator ? newCx : newCx.exec();
				}
				
				if (name) cx.scope.set(name, f);
				push(f);
			},
			array: function() {
				var count = next();
				var a = [];
				while (count > 0) {
					a.push(get());
					count--;
				}
				a.reverse();
				push(a);
			},
			object: function() {
				var count = next();
				var o = {};
				while (count > 0) {
					var value = get();
					o[pop()] = value;
					count--;
				}
				push(o);
			},
			"retval": function() { 
				cx.retval = get(); 
			},
			"return": function() {
				cx.ptr = -1;
				cx.exit = RETURN;
			},
			call: function() {
				var args = get();
				var f = pop(), who = null;
				var tmp = f;
				if (typeof(f) != "function") {
					// f is a reference
					who = f.who;
					if (who == null && f.id == "yield") {
						cx.retval = args[args.length-1];
						cx.exit = YIELD;
						cx.yieldPtr = cx.ptr;
						cx.ptr = -1;
						return;
					} else {
						f = f.value(cx);
						// FALL THROUGH
					}
				}
				if (top() == NEW) {
					// constructor
					pop();
					var code = "new f(";
					for (var i = 0; i < args.length; i++) {
						code += "args[" + i + "]";
						if (i < args.length - 1) code += ",";
					}
					code += ")";
					push(eval(code));
				} else {
					if (f.apply) {
						push(f.apply(who, args));
					} else {
						// hack workaround for Safari where apply may not exist
						eval("f(args[1],args[2],args[3],args[4],args[5])");
					}
				}
			},
			"if": function() {
				var elsePtr = next();
				if (!get()) {
					jump(elsePtr);
				}
			},
			"=": function() { var arg = get(); push(pop().define(cx, arg)); },
			".": function() { 
				var ref = pop(); 
				ref.who = get(); 
				push(ref); 
			},
			ref: function() { push(new Reference(get())); },
			number: function() { push(Number(get())); },
			"delete": function() { push(cx.scope.delete_(pop())); },
			initForIn: function() {
				var o = get();
				var forin = [];
				for (var n in o) forin.push(n);
				forin.ref = pop();
				forin.index = -1;
				cx[next()] = forin;
			},
			nextForIn: function() {
				var forin = cx[next()];
				if (++forin.index >= forin.length) {
					jump(next());
				} else {
					cx.scope.set(forin.ref.toString(), forin[forin.index]);
					next(); // jump ptr
				}
			},
			"throw": function() { throw pop(); },
			"catch": function() { 
				var ptr = next();
				if (ptr != -1) cx.catchPtr = ptr; 
			},
			finalize: function() { 
				var fptrPtr = next();
				if (fptrPtr) {
					var fptr = cx.bytecode[fptrPtr]; 
					if (fptr) {  // finally is optional
						cx[fptr] = cx.ptr; 
						jump(fptr); 
					}
				}
			},
			resume: function() {
				var fptr = next();
				var rptr = cx[cx.bytecode[fptr]]; 
				cx[cx.bytecode[fptr]] = null;
				if (rptr) jump(rptr);
			},
			setCx: function() { cx[next()] = pop(); },
			getCx: function() { push(cx[next()]); },
			pushWith: function() {
				cx.scope = new Scope(cx.scope, get());
			},
			popWith: function() {
				cx.scop = cx.scope.parent;
			}
		};
		
		each("| ^ & == != === !== < <= > >= in instanceof << >> >>> + - * / %".split(" "), function(op) {
			commands[op] = eval("(function() { var arg = get(); push(get() " + op + " arg) })");
		});
		
		each("! ~ void typeof".split(" "), function(op) {
			commands[op] = eval("(function() { push(" + op + " get()) })");
		});
	})();

	/* --- bytecode compilation --- */

	var compile;
	(function() {
		var tid;
		var cx;
		var tokens;
		
		var breaks = [];

		function context() {
			return {
				bytecode: [],
				vars: [],
				loop: null,
				labels: {},
				traps: []
			};
		}
		
		compile = function(_tokens) {	
			tid = 0;
			cx = context();
			tokens = _tokens;
			
			while(t()) {
				statement();
			}
			return cx.bytecode;
		}

		/* --- token processing helpers --- */
		
		function t() {
			return tokens[tid];
		}

		function tnext() {
			return tokens[tid++];
		}
		
		function tis(tok) {
			return t() == tok ? ++tid : false;
		}
		
		function tmust(tok) {
			if (tokens[tid++] != tok) interr("expected " + tok + " but got " + tokens[tid-1]);
			return true;
		}
						
		/* --- bytecode generation helpers --- */

		
		function call(/*...*/) {
			for (var i = 0; i < arguments.length; i++) {
				cx.bytecode.push(arguments[i]);
			}
			return cx.bytecode.length - 1;
		}
		
		function makeCall(command) {
			return function() {
				cx.bytecode.push(command);
				for (var i = 0; i < arguments.length; i++) {
					cx.bytecode.push(arguments[i]);
				}
				return cx.bytecode.length - 1;
			}
		}
		
		for (var n in commands) {
			if (n.match(/^\w+$/)) {
				eval("var $" + n + " = makeCall(n)");
			}
		}
		
		function mark(ptr) {
			cx.bytecode[ptr] = curPtr();
		}
		
		function curPtr() {
			return cx.bytecode.length;
		}
		
		function def(name) {
			cx.vars.push(name);
		}
		
		/* --- lexical structure: statements --- */
		
		function statement() {
			var tok = t();
			if (statements[tok]) {
				tnext();
				statements[tok]();
				if (tok == "function") $clear();
			} else if (tokens[tid+1] == ":") {
				var label = tnext();
				tnext();
				cx.labels[label] = curPtr();
				statement();
				delete cx.labels[label];
			} else {
				list();
				tis(';');
				$clear();
			}
		}

		var statements = {
			"function": function() {
				if (!tis('(')) {
					$push(tnext());
					tmust('(');
				} else {
					$push(null);
				}

				var c = 0;
				while (t() != ')') {
					c++;
					$push(tnext());
					if (t() != ')') tmust(',');
				}
				tmust(')');
				$array(c);
				
				tmust('{');
				var prevcx = cx; cx = context();	
				statements['{']();
				var body = cx.bytecode;
				var vars = cx.vars;
				var yields = cx.yields;
				cx = prevcx;
				$push(body), $push(vars), $push(yields), $function();
			},
			"{": function() {
				while (!tis('}')) {
					statement();
				}
			},
			"var": function(terminator) {
				do {
					def(t());
					expression(terminator);
					$pop();
				} while(tis(","));
			},
			"return": function() {
				if (!tis(";")) {
					list();
					tis(";");
				} else {
					$push(this.undefined);
				}
				$retval();
				doFinalize(-1);
				$return();
			},
			"if": function() {
				tmust('(');list();tmust(')');
				var elseref = $if(null);
				statement();
				
				if (tis("else")) {
					var doneref = $jump(null);
					mark(elseref);
					statement();
					mark(doneref);
				} else {
					mark(elseref);
				}
			},
			"while": function() { loop(whileBody); },
			"do": function() { loop(doBody); },
			"for": function() { loop(forBody); },
			"switch": function() { loop(switchBody) },
			"continue": function() { jumpLoop(1); },
			"break": function() { jumpLoop(3); },
			"try": function() {
				var trap = cx.traps[cx.traps.length] = {
					try_: curPtr(), 
					catch_: $catch(-1), 
					finally_: $pass(null)
				};

				// try

				statement();
				var endPtr = $jump(null);

				// catch

				if (tis("catch")) {
					tmust('(');
					trap.identifier = tnext();
					tmust(')');

					mark(trap.catch_);
					$setCx(trap.catch_);

					// special handling for exceptions within catch
					var exPtr = $catch(null);
					statement();

					// prevent use of the exception identifier after the catch
					trap.identifier = null;

					$jump(endPtr);

					// handle exception in catch
					mark(exPtr);
				} else {
					// we must do a fake catch to guarantee finalization
					mark(trap.catch_);
				}

				$setCx(trap.catch_);
				cx.traps.pop();
				$catch(cx.traps.length ? cx.traps[cx.traps.length-1].catch_ : null);
				$finalize(trap.finally_);
				$getCx(trap.catch_);
				$throw();

				// finally

				// clear out resume marker if execution falls through
				$finalize(null);
				mark(endPtr);
				if (tis("finally")) {
					mark(trap.finally_);
					statement();
					$resume(trap.finally_);
				}
			},
			"throw": function() {
				list();
				tis(";");
				$throw();
			},
			"with": function() {
				var start = curPtr();
				tmust('(');list();tmust(')');
				$pushWith();
				statement();
				$popWith();
			},
			";": function() {}
		};

		/* --- loop helpers --- */
		
		function loop(body) {
			with (cx) {
				var prev = loop;
				loop = curPtr();
				// declare continue/break pointers
				// default continue to outer loop for switch statements
				$pass(bytecode[prev]), $pass(null);
				body();
				loop = prev;
			}
		}
		
		function setContinue() {
			return cx.bytecode[cx.loop+1] = curPtr();
		}

		function setBreak() {
			return cx.bytecode[cx.loop+3] = curPtr();
		}
		
		function doContinue() {
			$jump(cx.bytecode[cx.loop+1]);
		}

		function whileBody() {
			setContinue();
			tmust('(');list();tmust(')');
			var doneref = $if(null);
			statement();
			doContinue();
			setBreak();
			mark(doneref);
		}

		function doBody() {
			var startptr = curPtr();
			statement();
			setContinue();
			tmust('while');tmust('(');list();tmust(')');
			var doneref = $if(null);
			$jump(startptr);
			setBreak();
			mark(doneref);
		}

		function forBody() {
			tmust('(');

			// setup
			var varDecl = null;
			if (t() != ';') {
				if (tis('var')) {
					statements["var"]("in");
					varDecl = true;
				} else {
					expression("in");
					varDecl = false;
				}
			}

			if (tis(";")) {
				// for
				
				// make sure the stack is empty
				if (varDecl != null && !varDecl) $pop();

				// condition
				var condptr = curPtr();
				if (!tis(';')) {
					expression();
					tis(";");
					var doneref = $if(null);
				}
				var bodyref = $jump(null);

				// update
				setContinue();
				if (!tis(')')) {
					expression();
					tmust(")");
					$pop();
				}
				$jump(condptr);

				// body
				mark(bodyref);
				statement();
				doContinue();
				if (doneref) mark(doneref);
				setBreak();
			} else {
				// for-in
				if (varDecl) $push(new Reference(cx.vars[cx.vars.length-1]));

				tmust("in");expression();tmust(')');

				// body
				$initForIn(cx.loop);
				setContinue();
				var doneref = $nextForIn(cx.loop, null);
				statement();
				doContinue();
				setBreak();
				mark(doneref);
			}
		}

		function switchBody() {
			tmust('(');expression();tmust(')');tmust('{');
			var nextCaseRef = null;
			var defaultRef = null;
			var caseActionRef = $pass(null);
			while (!tis('}')) {
				while (t() == 'case' || t() == 'default') {
					if (tis('case')) {
						// jump from case to case
						if (nextCaseRef) {
							mark(nextCaseRef);
							nextCaseRef = null;
						}

						// compare against discriminant
						$dup();
						expression(":");tmust(':');
						
						// remove discriminant and jump to the statements if true, 
						// skip to next case if not
						call('===', 'if', /* next case*/ curPtr() + 6, 'pop', 'jump', caseActionRef);
					} else {
						// hold onto our default until later
						tmust("default");tmust(":");
						defaultRef = caseActionRef;
					}
				}
				// cases didn't match -- jump to next case statement
				nextCaseRef = $jump(null);

				mark(caseActionRef);
				while (t() != '}' && t() != 'case' && t() != 'default') {
					statement();
				}
				// jump to the next set of case statements
				caseActionRef = $jump(null);
			}
			if (nextCaseRef) {
				mark(nextCaseRef);
			}
			// nothing matched, so we need to remove the discriminant
			$pop();
			if (defaultRef) $jump(defaultRef);
			setBreak();
			mark(caseActionRef);
		}

		function doFinalize(minPtr) {
			var i = cx.traps.length;
			while(i--) if (minPtr <= cx.traps[i].try_) {
				$finalize(cx.traps[i].finally_);
			}
		}

		function jumpLoop(offset) {
			doFinalize(cx.loop);
			$jump((t() == ";") ? cx.loop+offset : cx.labels[tnext()] + offset);
			tis(";");
		}
		
		/* --- lexical structure: expressions --- */

		var ops, opdata;
		
		function list() {
			do {
				expression();
			} while (tis(",") && $pop());
		}
		
		function expression(terminator) {
			// store context in case of recursion
			var $ops = ops, $opdata = opdata;
			var hook = 0, colon = 0;
			
			ops = [];
			opdata = [];

			EXPR: do {
				var tok = t();
				var op;
				// watch out for default properties like toString here
				while ((op = preops[t()]) && op.constructor == Object) {
					pushOp(op);
					tnext();
				}
				operand();
				while (checkOp(postops)) { /* loop */ }

				// deal with "in" ambiguity
				if (terminator) {
					var tok = t();
					if (tok == "?") hook++;
					else if (tok == ":" && hook > colon) colon++;
					else if (tok == terminator && hook <= colon) break EXPR;
				}
			} while (checkOp(inops));
			
			while (ops.length) {
				popOp();
			}
			
			// restore context
			ops = $ops; opdata = $opdata;
		}

		function operand() {
			var tok = tnext();
			var c = tok.charCodeAt(0);
			
			if (tok == "function") {
				statements["function"]();
			} else if (tok == "{") {
				var count = 0;
				while (!tis('}')) {
					count++;
					operand();
					tmust(":");
					expression();
					if (tis('}')) break;
					tmust(",");
				}
				$object(count);
			} else if (tok == "[") {
				var count = 0;
				if (!tis(']')) do {
					count++;
					expression();
					if (tis(']')) break;
				} while(tmust(','));
				$array(count);
			} else if (tok == "(") {
				list();
				tmust(")");
			} else if ((c >= 48 && c <= 57) || c == 46) { // 0-9, .
				$push(Number(tok));
			} else if (c == 34 || c == 39 || c == 47) { // string or RegExp
				$push(eval(tok));
			} else {
				var i = cx.traps.length;
				while (i--) {
					if (tok == cx.traps[i].identifier) {
						$getCx(cx.traps[i].catch_);
						return;
					}
				}
				if (tok == "yield" && t() == "(") {
					cx.yields = true;
				}
				$push(new Reference(tok));
			}
		}

		// TODO: division masking as regexp
		
		var onPush = {
			"||": function(op) {
				$dup("!");
				opdata[ops.length] = $if(null);
				$pop();
			},
			"&&": function(op) {
				$dup();
				opdata[ops.length] = $if(null);
				$pop();
			},
			"?": function(op) {
				opdata[ops.length] = $if(null);
			},
			":": function(op) {
				// get rid of any other ternaries -- their done now.
				if (ops.length && ops[ops.length-1].token == ":") {
					popOp(); // pop ':'
					popOp(); // pop '?'
				}
				
				if (!ops.length || ops[ops.length-1].token != '?')
					interr("expected ? to match :");
				
				opdata[ops.length] = $jump(null);
				mark(opdata[ops.length-1]);
			},
			"(": function(op) {
				var count = 0;
				if (!tis(')')) do {
					expression();
					count++;
					if (tis(')')) break;
				} while (tmust(','));
				$array(count);
				$call();
			},
			"[": function(op) {
				list();
				tmust("]");
				$ref();
				call(".");
			},
			"new": function(op) {
				$push(NEW);
			}
		};
		
		function pushOp(op) {
			var handler = onPush[op.token];
			if (handler) {
				handler(op);
			}
			ops.push(op);
		}
		
		var onPop = {
			"++": function(op) {
				if (op == postops["++"]) {
					// "correct" would be dup, dup, get, pull 1, push 1, +, =, pop
					// but this is fewer instructions and works
					call("dup","push",1,"+","=","push",1,"-");
				} else {
					call("dup","push",1,"+","=");
				}
			},
			"--": function(op) {
				if (op == postops["--"]) {
					call("dup","push",1,"-","=","push",1,"+");
				} else {
					call("dup","push",1,"-","=");
				}
			},
			"||": function(op) {
				mark(opdata[ops.length]);
			},
			"&&": function(op) {
				mark(opdata[ops.length]);
			},
			"?": function(op) { },
			":": function(op) {
				mark(opdata[ops.length]);
			},
			"(": function() {},
			"[": function() {},
			"new": function() {}
		};

		// bytecode generation for assign ops
		each(["+","-","*","/","%","|","&","<<",">>",">>>"], function(tok) {
			onPop[tok + "="] = function() {
				call("pull",1,"dup","pull",2,tok,"=");
			};
		});

		each(["+","-"], function(tok) {
			onPop[tok] = function(op) {
				if (preops[tok] == op) {
					$push(0), $pull(1), $number();
				}
				call(tok);
			}
		});
		
		function popOp() {
			var op = ops.pop();
			var handler = onPop[op.token];
			if (handler) {
				handler(op);
			} else {
				call(op.token);
			}
		}
		
		function checkOp(lookup) {
			var tok = t();
			var op;
			if (op = lookup[tok]) {
				while (ops.length && 
					   ops[ops.length-1].precedence - (op.right?1:0)
						 >= op.precedence) 
				{
					popOp();
				}
				tnext(); // BEFORE pushOp in case the op wants to parse.
				pushOp(op);
				return true;
			} else {
				return false;
			}
		}
	})();

	/* --- JS tokenizer --- */
	
	// use a custom sort to work around Safari sorting bug
	function sort(a,b) {
		if (a.length != b.length) {
			var min = Math.min(a.length, b.length);
			if (a.substr(0, min) == b.substr(0, min)) {
				return a.length < b.length ? -1 : 1;
			}
		}
		return a < b ? -1 : 1;
	}
	
	var patterns = {
		op:         (allops.sort(sort).reverse().join(" ") + " ; , [ ] { } ( )").replace(/([^ a-zA-Z])/g, "\\$1").replace(/ +/g, "|"),
		regexp:     "/(?:\\.|[^\n/])+/[a-z]*",
		number:     ["(?:[1-9][0-9]+|[0-9])(?:\\.[0-9]+)?(?:[eE][\\+\\-]?[0-9]+)?","0[xX][\da-fA-F]+","0[0-7]*"].join("|"),
		string:     ["'(?:\\\\.|[^'\n])*'",'"(?:\\\\.|[^\"\n])*"'].join("|"),
		identifier: "[$a-zA-Z_][\\w]*"
	}

	var token_pattern = "identifier|string|number|regexp|op".replace(/(\w+)/g, function(match){return patterns[match]}); 
	var tokenizer = new RegExp(token_pattern, "g");

	// our JS evaluator -- global
	js = function(scope, code) {
		// init the scope
		scope();
		scope = new Scope(scope);
		var bytecode = compile(code.toString().match(tokenizer));
		var cx = new ExecContext(scope, bytecode);
		return cx.exec(true);
	}
})();

(function() {
	// separate anonymous invokation to prevent local vars from
	// leaking into the context
	SCOPE = function() {
		arguments.callee.set = function() {
			return eval(arguments[0] + " = arguments[1]");
		}
		
		arguments.callee.get = function() {
			return eval(arguments[0]);
		}
		
		arguments.callee.delete_ = function() {
			return eval("delete " + arguments[0]);
		}
	}
})();
