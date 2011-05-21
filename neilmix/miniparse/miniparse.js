(function() {
	var DEBUG = false;
	var indent = "";

	var tokens;
	var current = 0;
	var rules = {};
	var allOps = [];
	var preOps = {};
	var postOps = {};
	
	function each(array, method) {
		for (var i = 0; i < array.length; i++) {
			array[i] = method(array[i]);
		}
		return array;
	}
	
	function arrayNodeToString() {
		return this.join(" ");
	}
	
	function node(n, type, name) {
		if (!n) return n;
		if (!n.type && type) n.type = type;
		if (!n.name && name) n.name = name;		
		if (typeof(n) == "object") {
			// array
			n.toString = arrayNodeToString;
		}
		return n;
	}
	
	function make_parser(arg) {
		var type = typeof(arg);
		if (typeof(arg) == "function") {
			return arg;
		} else if (type == "object" && arg && arg.constructor === Array) {
			return sequence.apply(this, arg);
		} else if (arg.length > 1 && arg.charAt(arg.length-1) == "?") {
			return maybe(arg.substr(0,arg.length-1));
		} else if (arg.length > 1 && arg.charAt(0) == "$") {
			return rule_seek.apply(this, arg.substr(1).split("="));
		} else {
			return symbol(arg);
		}
	}

	function rule(type, parser) {
		parser = make_parser(parser);
		rules[type] = function() {
			if (DEBUG) {
				print(indent, type);
				indent += "  ";
				var prev = current;
				var retval = node(parser(),type,null);
				indent = indent.substr(2);
				if (retval) {
					print("+" + indent + type + ": " + retval);
				} else {
					print(" " + indent + type + ": " + tokens.slice(prev, prev + 5).join(" "));
				}
				return retval;
			} else {
				return node(parser(),type,null);
			}
		}
	}

	function rule_seek(ruleName, nodeName) {
		var parser;
		return function() {
			if (!parser) parser = rules[ruleName];
			return node(parser(),null,nodeName);
		}
	}

	function select(/*...*/) {
		var args = each(arguments, make_parser);
		return function() {
			for (var i = 0; i < args.length; i++) {
				var result = args[i]();
				if (result) return result;
			}
		}
	}
		
	function sequence(/*...*/) {
		var args = each(arguments, make_parser);
		return function() {
			var rollback = current;
			var retval = [];
			for (var i = 0; i < args.length; i++) {
				var result;
				if (result = args[i]()) {
					if (result && result.name) retval[result.name] = result;
					retval.push(result);
				} else {
					current = rollback;
					return;
				}
			}
			return retval;
		}
	}

	function maybe(parser, name) {
		parser = make_parser(parser);
		return function() {
			var result = parser();
			return result ? node(result,null,name) : " ";
		}
	}
	
	function star(parser,name) {
		parser = make_parser(parser);
		return function() {
			var retval = [];
			while(1) {
				var rollback = current;
				var result = parser();
				if (result) {
					retval.push(result);
				} else {
					current = rollback;
					break;
				}
			}
			return node(retval,null,name);
		}
	}
	
	function not(symbol, parser) {
		parser = make_parser(parser);
		return function() {
			if (tokens[current] != symbol) {
				return parser();
			}
		}
	}
	
	function list(min, parser, name) {
		parser = make_parser(parser);
		return function() {
			var rollback = current;
			var retval = [];
			retval.name = name;
			while(1) {
				if (retval.length >= min) rollback = current;
				var result = parser();
				if (!result) {
					current = rollback;
					break;
				}
				retval.push(result);
				
				if (tokens[current] == ",") {
					current++;
				} else {
					break;
				}
			}
			return retval.length < min ? "" : retval;
		}
	}
	
	function symbol(sym) {
		return function() {
			return tokens[current] == sym ? tokens[current++] : "";
		}
	}
	
	function matchArg(lookup) {
		for (var n in lookup) {
			lookup[n] = make_parser(lookup[n]);
		}
		return function() {
			var symbol = tokens[current];
			var parser = lookup[symbol];
			if (!parser) return;	
			return node(parser(),symbol,null);
		}
	}
	
	// postfix unary
	function postOp(precedence, symbols, opParser, name, opName) {
		opParser = opParser ? make_parser(opParser) : null;
		each(symbols, function (sym) {
			postOps[sym] = function(operand) {
				allOps.push(sym);
				var op = sym;
				if (opParser) {
					// we've already moved past the op -- move back
					current--;
					if (!(op=opParser())) return; else op = node(op);
				}
				
				var n = [operand, op];
				n.operand = operand;
				n.post = true;
				if (opName) n[opName] = op[opName];
				return node(n, name || sym, null);
			}
			postOps[sym].precedence = precedence;
		});
	}
	
	function op(precedence, symbols, right) {
		var parseOperand = expr(precedence + (right ? 0 : 1))
		each(symbols, function (sym) {
			allOps.push(sym);
			postOps[sym] = function(operand1) {
				var operand2 = parseOperand();
				if (!operand2) return;
	
				var retval = [operand1, sym, operand2];
				retval.left = operand1;
				retval.right = operand2;
				return node(retval, sym);
			}
			postOps[sym].precedence = precedence;
			postOps[sym].infix = true;
		});
	}
	
	function preOp(precedence, symbols) {
		each(symbols, function (sym) {
			allOps.push(sym);
			var parseOperand = expr(precedence);
			preOps[sym] = function() {
				current++;
				var operand = parseOperand();
				if (!operand) {
					current--;
					return;
				}
				var n = [sym, operand];
				n.operand = operand;
				return node(n, sym, null);
			}
			preOps[sym].precedence = precedence;
		});
	}

	function expr(precedence) {
		var parseOperand = rule_seek("operand");
		return function() {
			var left;
			var preParser = preOps[tokens[current]];
			if (preParser) {
				if (preParser.precedence < precedence || !(left = preParser())) {
					return;
				}
			}
			
			if (!left && !(left = parseOperand())) return;

			while (1) {				
				op = tokens[current];
				var right;
				var postParser = postOps[op];
				if (!postParser || postParser.precedence < precedence) return left;
				
				if (preParser && preParser.infix && preParser.precedence < postParser.precedence) {
					throw new Error(
						"Internal parser error, bad precedence: op: "
						+ op + ", left prec: " + preParser.precedence
						+ ", right prec: " + postParser.precedence
						+ ", left: " + left);
				}

				var rollback = current++;
				if (right = postParser(left)) {
					preParser = postParser;
					left = right;
				} else {
					current = rollback;
					return left;
				}
			}
		}
	}
			

	// ---------- JavaScript grammar ----------

// TODO: for-in
// TODO: division masking as regexp

	rule("statement", select(
		matchArg({
				"function": "$function",
				"{": "$block",
				"if": ["if","(","$expression=condition",")","$statement=body",maybe(["else", "$statement=body"],"elseClause")],
				"switch": ["switch","(","$expression=key",")","{",star("$case","cases"),"}"],
				"for": select(["for", "(", select("$var", "$semicolon"), "$expression=condition?", ";", "$expression=update?", ")", "$statement=body"],
				              ["for", "(", maybe("var", "declared"), "$identifier=name", "in", "$expression=object", ")", "$statement=body"]),
				"while": ["while","(","$expression=condition",")","$statement=body"],
				"do": ["do","$statement=body","while","(","$expression=condition",")"],
				"break": ["break","$identifier=label?",";"],
				"continue": ["continue","$identifier=label?",";"],
				"try": ["try","$statement=body", 
				        maybe(["catch","(","$expression=exception",")","$statement=body"],"catchClause"), 
				        maybe(["finally"],"$statement=body","finallyClause")],
				"throw": ["throw","$expression=exception", ";"],
				"return": ["return","$expression=value?",";"],
				"with": ["with","(","$expression=object","$statement=body"],
				"var": "$var"
			},
			{ ":": "$label" }
		), 
		"$semicolon"
	));
	rule("function", ["function", maybe("$identifier","name"),"(",list(0,"$identifier","params"),")","$block=body"]);
	rule("block", ["{", star("$statement","statements"), "}"]);	
	rule("label", not("case",["$identifier=name",":"]));
	rule("case", matchArg({
		"default": ["default",":",star("$statement","statements")], 
		"case": ["case","$expression=match",":",star("$statement","statements")]
	}));
	rule("var", ["var",list(1,"$expression","names"), ";"]);
	rule("semicolon", [maybe("$expression","expression"),";"]);
	rule("expression", expr(1));
	rule("identifier", function() { 
		var symbol = tokens[current];
		var c = symbol.charCodeAt(0);
		if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c == 36) {
			current++;
			return symbol;
		}
	});
	rule("object", ["{",list(0,["$operand=name",":","$expression=value"],"properties"),maybe(","),"}"]);
	rule("array", ["[",list(0,"$expression","values"),maybe(","),"]"]);
	rule("list", ["(",list(1,"$expression","values"),")"]);

	rule("operand", select(
		matchArg({
			"function": "$function",
			"{": "$object",
			"[": "$array",
			"(": "$list"
		}),
		"$identifier",
		// terminals
		function () {
			var type;
			var symbol = tokens[current];
			var c = symbol.charCodeAt(0);
			if (c == 34 || c == 39) {
				type = "string";
			} else if (c == 47) {
				type = "regexp";
			} else if (c >= 48 && c <= 57) {
				type = "number";
			}
			if (type) {
				current++;
				return node(symbol, type);
			}
		}
	));

	// op precedence
	op(1,["=","+=","-=","*=","/=","%=","|=","&=","<<=",">>=",">>>="],true)
	op(2,["?",":"],true);
	op(3,["||"]);
	op(4,["&&"]);
	op(5,["|"]);
	op(6,["^"]);
	op(7,["&"]);
	op(8,["==","!=","===","!=="]);
	op(9,["<","<=",">",">=","in","instanceof"]);
	op(10,["<<",">>",">>>"]);
	op(11,["+","-"]);
	op(12,["*","/","%"]);
	preOp(13,["void","delete","typeof","++","--"]);
	preOp(14,["!","~","+","-"]);
	postOp(15,["++","--"]);
	preOp(16,["new"]);
	postOp(17,["("],["(",list(0,"$expression","args"),")"], "call", "args");
	postOp(17,["["],["[","$expression=key","]"], "index", "key");
	op(18,["."],true);
	
	// ------------ JavaScript tokenizer and parser -------------

	var patterns = {
		op:         (allOps.sort().reverse().join(" ") + " ; , [ ] { } ( )").replace(/([^ ])/g, "\\$1").replace(/ +/g, "|"),
		regexp:     "/(?:\\.|[^\n/])+/[a-z]*",
		number:     ["(?:[1-9][0-9]+|[0-9])(?:\\.[0-9]+)?(?:[eE][\\+\\-]?[0-9]+)?","0[xX][\da-fA-F]+","0[0-7]*"].join("|"),
		string:     ["'(?:\\\\.|[^'\n])*'",'"(?:\\\\.|[^\"\n])*"'].join("|"),
		identifier: "[$a-zA-Z][\\w]*"
	}
	var token_pattern = "identifier|string|number|regexp|op".replace(/(\w+)/g, function(match){return patterns[match]}); 
	var tokenizer = new RegExp(token_pattern, "g");
	
	var function_parser = rule_seek("function");
	parseFunction = function (func) {
		if (typeof(func) != "function")
			throw new Error("param to parsejs must be a function");
		
		tokens = func.toString().match(tokenizer);
		current = 0;
		var result = function_parser();
		if (!result) throw new Error("Internal parse error.  The parser is broken, sorry.");
		return result;
	}
})();

