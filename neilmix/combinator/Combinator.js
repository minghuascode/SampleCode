function Combinator() {
	// magic token indicating parse failed
	var FAIL = { toString: function() { return "FAIL"; } };
	
	// magic tokens indicating result should not show up in sequence results
	var VOID = this.VOID = { toString: function() { return "VOID"; } };
	var OMIT = this.OMIT = { toString: function() { return "OMIT"; } };

	var text      = "";
	var len       = 0;
	var chars     = [];
	var pos       = 0;
	var construct = true;
	var furthest  = 0;
	var writers   = {};

	this.parser = function(parseFunc) {
		parseFunc = make_arg(parseFunc);
		return function(the_text) {
			text      = the_text;
			chars     = text.split("");
			len       = chars.length;
			pos       = 0;
			furthest  = 0;
			construct = true;
			result = parseFunc();

			if (result === FAIL || pos < len) {
				var lines = the_text.split("\n");
				var i = 0, current = 0;
				while (i < lines.length && furthest - current >= lines[i].length) {
					current += lines.length;
					i++;
				}
				var message = "Parse error: ";
				message += "at line " + i + " char " + (furthest - current) + "\n";
				message += "\t" + lines[i] + "\n";
				message += "\t";
				for (var j = 0; j < furthest - current; j++) {
					message += ".";
				}
				message += "^\n";
				throw new Error(message);
			} else {
				return result;
			}
		}
	}

	var rule = this.rule = function(name, parser) {
		parser = make_arg(parser);
		return this[name] = function() {
			return function() {
				var rollback = pos;
				var result = parser();
	
				if (result === FAIL) {
					pos = rollback;
					if (furthest < pos) furthest = pos;
					return FAIL;
				} else {
					var writer = writers[name];
					if (writer) {
						return writer(result);
					} else {
						return result;
					}
				}
			}
		}
	}

	var attempt = this.attempt = function(parser) {
		parser = make_arg(parser);
		return function() {
			var rollback = pos;
			var result = parser();
			if (result === FAIL) {
				pos = rollback;
				return FAIL;
			} else {
				return result;
			}
		}
	}

	var make_arg = this.make_arg = function(parser_arg) {
		if (parser_arg === true)
			return ch(null);

		var type = typeof(parser_arg);
		if (type === "function") {
			return parser_arg;
		} else if (type === "object" && parser_arg && parser_arg.constructor === Array) {
			return sequence.apply(this, parser_arg);
		} else {
			parser_arg = String(parser_arg);
			if (parser_arg.length === 1) {
				return ch(parser_arg);
			} else {
				return symbol(parser_arg);
			}			
		}
	}
	
	// character match functions
	
	var ch = this.ch = function(c) {
		if (c === null) {
			return function() {
				return pos < len ? chars[pos++] : FAIL;
			}
		} else {
			return attempt(function() {
				if (pos < len) {
					return chars[pos++] === c ? c : FAIL;
				} else {
					return FAIL;
				}
			});
		}
	}
	
	var range = this.range = function(clow, chigh) {
		return attempt(function() {
			if (pos >= len)
				return FAIL;
			
			var c = chars[pos++];
			return (c >= clow && c <= chigh) ? c : FAIL;
		});
	}

	var symbol = this.symbol = function(s) {
		var schars = s.split("");
		return attempt(function() {
			if (pos + schars >= len)
				return FAIL;

			var start = pos;
			while (pos-start < schars.length) {
				if (schars[pos-start] !== chars[pos]) {
					return FAIL;
				}
				pos++;
			}
			return s;
		});
	}
	
	var not = this.not = function(parser) {
		parser = peek(parser);
		return function() {
			if (pos < len && parser() === FAIL) {
				return chars[pos++];
			} else {
				return FAIL;
			}
		}
	}

	var except = this.except = function(parser) {
		return slice(plus(not(parser)));
	}
	
	// output generating functions
	
	// TODO: what if parser consumes no input?
	var repeat = this.repeat = function(parser, low, high) {
		parser = make_arg(parser);
		return attempt(function() {
			var results = construct === true ? [] : null;
			var count   = 0;
			
			while(pos < len && (high === null || count < high)) {
				var result;
				if ((result = parser()) === FAIL) {
					break;
				} else if (result === VOID) {
					throw new Error("peek() and not() may not be passed to repeat()");
				}

				if (construct === true && result !== OMIT) {
					results.push(result);
				}
				count++;
			}

			if (low === null || count >= low) {
				return results;
			} else {
				return FAIL;
			}
		});
	}

	var star = this.star = function(parser) {
		return repeat(parser, null, null);
	}
	
	var plus = this.plus = function(parser) {
		return repeat(parser, 1, null);
	}
	
	var maybe = this.maybe = function(parser) {
		parser = attempt(parser);
		return function() {
			var result;
			return (result = parser()) === FAIL ? null : result;
		}
	}

	var sequence = this.sequence = function(/*...*/) {
		var args = arguments;
		for (var i = 0; i < args.length; i++) {
			args[i] = make_arg(args[i]);
		}
		return attempt(function() {
			var results = null;
			var count = 0;
			for (var i = 0; i < args.length; i++) {
				var result = args[i]();
				if (result === FAIL) {
					return FAIL;
				} else if (result !== OMIT && result !== VOID && construct === true) {
					switch (count) {
						case 0:  results = result; break;
						case 1:  results = [results, result]; break;
						default: results.push(result);
					}
					count++;
				}
			}
			return results;
		});
	}
	
	var select = this.select = function(/*...*/) {
		var args = arguments;
		for (var i = 0; i < args.length; i++) {
			args[i] = attempt(args[i]);
		}
		return function() {
			for (var i = 0; i < args.length; i++) {
				var result = args[i]();
				if (result === VOID) {
					throw new Error("peek() and not() may not be used as argument to select()");
				} else if (result !== FAIL) {
					return result;
				}
			}
			return FAIL;
		}
	}
	
	// input preserving functions

	var peek = this.peek = function(parser) {
		parser = make_arg(parser);
		return function() {
			var rollback = pos;
			var result;
			if (construct === true) {
				construct = false;
				var result = parser();
				construct = true;
			} else {
				result = parser();
			}
			pos = rollback;
			return result === FAIL ? FAIL : VOID;
		}
	}

	// output altering functions
	
	var omit = this.omit = function(parser) {
		parser = make_arg(parser);
		return attempt(function() {
			if (construct === true) {
				construct = false;
				var result = parser();
				construct = true;
			} else {
				var result = parser();
			}
			return result === FAIL ? FAIL : OMIT;
		});
	}
	
	var slice = this.slice = function(parser) {
		parser = omit(parser);
		return function() {
			var pre = pos;
			var result = parser();
			if (result === FAIL) {
				return FAIL;
			} else {
				return construct === true ? text.slice(pre, pos) : null;
			}
		}
	}
	
	var list = this.list = function(item, separator) {
		item      = make_arg(item);
		separator = make_arg(separator);
		return attempt(function() {
			var result;
			if ((result = item()) === FAIL)
				return construct === true ? [] : null;

			var results = construct === true ? [result] : null;
			var rollback = pos;
			while (pos < len && separator() !== FAIL && (result = item()) !== FAIL) {
				if (construct === true)
					results.push(result);
				rollback = pos;
			}
			pos = rollback;
			return results;
		});
	}

	var table = this.table = function(key, delimiter, value, separator) {
		key        = make_arg(key);
		delimiter  = make_arg(delimiter);
		value      = make_arg(value);
		separator  = make_arg(separator);
		return attempt(function() {
			var results = construct === true ? {} : null;
			var keyResult, valueResult;

			if ((keyResult = key()) === FAIL 
			    || delimiter() === FAIL 
			    || (valueResult = value()) === FAIL) return results;

			results[keyResult] = valueResult;
			
			var rollback = pos;
			while (pos < len
			       && separator() !== FAIL 
			       && (keyResult = key()) !== FAIL 
			       && delimiter() !== FAIL
			       && (valueResult = value()) !== FAIL) 
			{
				if (construct === true)
					results[keyResult] = valueResult;
				rollback = pos;
			}
			pos = rollback;
			return results;
		});
	}
	
	// hack for forward-referencing rules
	var $ = this.$ = function(rulename) {
		var parser = null;
		var _this = this;
		return function() {
			if (parser === null) {
				if (_this[rulename] === null) {
					throw new Error("rule not defined: " + rulename);
				} else {
					parser = _this[rulename]();
				}
			}
			return parser();
		}
	}
	
	var output = this.output = function(name, outputFunc) {
		writers[name] = outputFunc;
	}
}

