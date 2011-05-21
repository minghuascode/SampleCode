/*
 * Copyright (c) 2006, Neil Mix
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright notice, 
 *   this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, 
 *   this list of conditions and the following disclaimer in the documentation 
 *   and/or other materials provided with the distribution.
 * - Neither the name of Neil Mix nor the names of its contributors may be used 
 *   to endorse or promote products derived from this software without specific 
 *   prior written permission.
 * - An email must be sent to neilmix -at- gmail -dot- com indicating that this
 *   software is being used, optionally describing the purpose of such use.
 *   (Any such email communication is strictly confidential and will not be 
 *    shared with any 3rd party. It is requested purely for the author's
 *    satisfaction and joy at knowing that his software is used by others.)
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE 
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE.
 */

function ParseExp(grammar, astb) {
	if (typeof(grammar) == "string") {
		grammar = ParseExp.pegParser.parse("Grammar", grammar);
	}
	
	this.grammar = grammar;
	this.astb = astb;
	this.tokenSequence = 0;
	this.anonSequence = 0;
	for (var n in grammar) {
		if (grammar[n].type == null)
			continue;

		this["parse_" + n] = this.compilePattern(grammar[n], astb == null || astb[n] != null);
	}
}

ParseExp.prototype.getParseStats = function() {
	return {
		parseTime: this.parseTime,
		toString: function() {
			return "parseTime:  " + this.parseTime + "\n";
		}
	}
}
	
ParseExp.prototype.parse = function(rule, text) {
	this.text  = text;
	this.input = text.split("");
	this.input.text = text;
	this.maxRead = 0;

	var t = new Date().getTime();
	if (!this["parse_" + rule])
		throw new Error("Unknown rule: " + rule);
	
	var result = this["parse_" + rule](this.input, 0, this.astb);
	this.parseTime = new Date().getTime() - t;

	if (result && result.consumed == text.length) {
		if (this.astb && this.astb[rule]) {
			return this.astb[rule].apply(this.astb, result);
		} else {
			return new this.Node(rule, result);
		}
	} else {
		var pos = this.maxRead;
		var lines = text.split("\n");
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			if (line.length >= pos) {
				var message = "Parse error\nline " + (i+1) + ":" + line + "\n";
				message += "line " + (i+1) + ":";
				for (var i = 0; i < pos-1; i++) {
					message += ".";
				}
				message += "^\n";
				throw new Error(message);
			}
			pos -= line.length + 1;
		}
	}
}

ParseExp.prototype.addToken = function(token) {
	var name = "_t" + this.tokenSequence++;
	this[name] = token;
	return name;
}

ParseExp.prototype.compilePattern = function(pattern, returnResults) {
	var C = ParseExp.PEG_AST_BUILDER;
	var code = [];
	code.indent = "";
	code.add = function(str) {
		this.push(this.indent + str);
	}
	code.increaseIndent = function() {
		this[this.length-1] += " {";
		this.indent += "\t";
	}
	code.decreaseIndent = function() {
		this.indent = this.indent.substr(0, this.indent.length - 1);
		this.add("}");
	}
	code.dropIndent = function() {
		while(this.indent.length) {
			this.decreaseIndent();
		}
	}
	
	var resultsIndex = 0;
	var looped = false;
	for (var i = 0; i < pattern.length; i++) {	
		
		if (resultsIndex > 1 || looped || i == 0) {
			var decl = i == 0 ? "var " : "";
			code.add(decl + 'consumed = 0;');
			code.add(decl + 'pos = inputPos;');
			if (returnResults)
				code.add(decl + 'results = null;');
		}
		
		var indent = "";
		var seq = pattern[i];
		resultsIndex = 0;
		looped = false;
		for (var j = 0; j < seq.length; j++) {			
			var expr    = pattern[i][j];
			var primary = expr;
			var prefix  = null;
			var suffix  = null;
			if (primary.type == C.ID_AND || primary.type == C.ID_NOT) {
				prefix  = expr.type;
				primary = expr.primary;
			} else if (primary.type == C.ID_QUESTION
				       || primary.type == C.ID_STAR
				       || primary.type == C.ID_PLUS)
			{
				suffix  = expr.type;
				primary = expr.primary;
			}
						
			var prepCode     = "";
			var matchCode    = "";
			var consumedCode = "";
			var resultCode   = "";
			switch (primary.type) {
				case C.ID_IDENTIFIER:
					prepCode = 'var match = null;';
					if (!this.grammar[primary.string])
						throw new Error("Unknown rule: " + primary.string);
					
					matchCode = '(match = this.parse_' + primary.string + '(input, pos, astb)) != null';
					if (this.astb) {
						if (this.astb[primary.string]) {
							consumedCode = 'match.consumed';
							resultCode = 'astb.' + primary.string + '.apply(astb, match)';
						} else {
							consumedCode = 'match';
							resultCode = 'match';
						}
					} else {
						consumedCode = 'match.consumed';
						resultCode = 'new this.Node("' + primary.string + '", match)';
					}
					break;
			
				case C.ID_PATTERN:
					if (!primary.name)
						primary.name = pattern.name + "_" + i + "_" + j;

					prepCode = 'var match = null;';

					// compile the anonymous pattern
					primary.parseFunctionName = "parseGroup_" + primary.name;
					this[primary.parseFunctionName] = this.compilePattern(primary, !primary.grab);

					matchCode    = '(match = this.' + primary.parseFunctionName + '(input, pos, astb)) != null';
					consumedCode = primary.grab ? 'match' : 'match.consumed';
					resultCode   = returnResults && primary.grab ? 
					               'this.text.substr(pos, match)' : 
					               'match.length == 1 ? match[0] : match';
					break;
								
				case C.ID_LITERAL:
					if (!primary.valueToken) {
						primary.valueToken = this.addToken(primary.value);
						primary.stringToken = this.addToken(primary.string);
						primary.valueTokens = [];
						for (var k = 0; k < primary.value.length; k++) {
							primary.valueTokens.push(this.addToken(primary.value[k]));
						}
					}
					
					var conditions = ['input[pos] == this.' + primary.valueTokens[0]];
					for (var k = 1; k < primary.value.length; k++) {
						conditions.push('input[pos + ' + k + '] == this.' + primary.valueTokens[k]);
					}
					
					matchCode    = conditions.join(" && ");
					consumedCode = primary.value.length;
					resultCode   = "this." + primary.stringToken;
					break;

				case C.ID_CLASS:
					var conditions = [];
					for (var k = 0; k < primary.ranges.length; k++) {
						var range = primary.ranges[k];
						if (!range.lowToken)
							range.lowToken = this.addToken(range.low);

						if (range.high) {
							if (!range.highToken)
								range.highToken = this.addToken(range.high);

							conditions.push('(ch >= this.' + range.lowToken + 
							                ' && ch <= this.' + range.highToken + ')');
						} else {
							conditions.push('ch == this.' + range.lowToken);
						}
					}

					prepCode     = 'var ch = input[pos];'
					matchCode    = conditions.join(' || ');
					consumedCode = 1;
					resultCode   = 'ch';
					break;
								
				case C.ID_DOT:
					prepCode     = 'var ch = input[pos];'
					matchCode    = 'ch != null';
					consumedCode = 1;
					resultCode   = 'ch';
					break;
							
				default:
					throw new Error("unknown primary type: " + primary.type);
			}
			
			if (j > 0)
				code.add('pos = inputPos + consumed');
			if (prepCode != "")
				code.add(prepCode);
			
			if (prefix) {
				if (prefix == C.ID_NOT) {
					code.add("if (!(" + matchCode + "))");
				} else {
					code.add("if (" + matchCode + ")");
				}
				code.increaseIndent();
			} else {
				if (suffix == C.ID_STAR || suffix == C.ID_PLUS) {
					looped = true;
					if (returnResults)
						code.add("var output = null;");
					
					code.add("while (" + matchCode + ")");
					code.increaseIndent();
					if (returnResults)
						code.add("output ? output.push(" + resultCode + ") : output = [" + resultCode + "];");

					code.add("consumed += " + consumedCode + ";");
					code.add('pos = inputPos + consumed');
					if (prepCode != "")
						code.add(prepCode);

					code.decreaseIndent();
					if (suffix == C.ID_PLUS) {
						if (returnResults) {
							code.add("if (output)");
						} else {
							// if a PLUS didn't consume input, it would 
							// go into an infinite loop, thus consumed must be > 0 
							// if it matched.
							code.add("if (consumed)");
						}
						code.increaseIndent();
					}
					resultCode = "output || []";
				} else {
					code.add("if (" + matchCode + ")");
					code.increaseIndent();
					code.add("consumed += " + consumedCode + ";");
					if (suffix == C.ID_QUESTION)
						code.decreaseIndent();
				}
				if (returnResults) {
					if (resultsIndex) {
						code.add("results[" + resultsIndex + "] = " + resultCode + ";");
					} else {
						code.add("results = [" + resultCode + "];");
					}
					resultsIndex++;
				}
			}
		}

		if (returnResults) {
			if (resultsIndex) {
				code.add('results.consumed = consumed;');
			} else {
				code.add("results = [];");
				code.add("results.consumed = 0;");
			}
			code.add('return results;');
		} else {
			code.add('return consumed;');
		}
		code.dropIndent();
	}
			
		
	code.add('if (inputPos + consumed > this.maxRead)');
	code.add('\tthis.maxRead = inputPos + consumed;');

	code.add('return null;');

	pattern.parseFunction = new Function("input", "inputPos", "astb", code.join("\n"));	
	return pattern.parseFunction;
}

ParseExp.prototype.Node = function(type, children) {
	this.type = type;
	this.children = children;
}

ParseExp.prototype.Node.prototype.toString = function(indent) {
	indent = indent || "";
	if (this.children.length == 0)
		return "{ type: " + this.type + " }";
	
	var str = "{\n" + indent + "    type: " + this.type	+ ",\n";
	for (var i = 0; i < this.children.length; i++) {
		str += this.childToString(this.children[i], indent + "    ", i);
		
		if (i != this.children.length - 1)
			str += ",";
			
		str += "\n";
	}
	str += indent + "}";
	return str;
}

ParseExp.prototype.Node.prototype.childToString = function(child, indent, label) {
	var str = indent;
	if (label != null)
		str += label + ": ";
	
	if (typeof(child) == "object" && child.constructor == this.constructor) {
		str += child.toString(indent);
	} else if (typeof(child) == "object" && child.constructor == Array) {
		if (child.length == 0) {
			str += "[]";
		} else {
			str += "[\n";
			for (var i = 0; i < child.length; i++) {
				str += this.childToString(child[i], indent + "    ");
				
				if (i != child.length - 1)
					str += ",";
				
				str += "\n";
			}
			str += indent + "]"
		}
	} else if (typeof(child) == "string") {
		child = child.replace(/\n/g, "\\n");
		child = child.replace(/"/g, '\\"');
		str += '"' + child + '"';
	} else {
		str += child;
	}
	return str;
}

ParseExp.PEG_AST_BUILDER = {
	ID_PATTERN: 1,
	ID_SEQUENCE: 2,
	ID_IDENTIFIER: 3,
	ID_LITERAL: 4,
	ID_CLASS: 5,
	ID_RANGE: 6,

	Grammar: function(spacing, definitions, eof) {
		var table = {};
		table.$order = [];
		for (var i = 0; i < definitions.length; i++) {
			table[definitions[i].name] = definitions[i];
			table.$order.push(definitions[i].name);
		}
		
		if (typeof(table.toString) != "object") { // check just in case someone stupidly makes a "toString" rule
			table.toString = function() {
				var rules = [];
				for (var i = 0; i < table.$order.length; i++) {
					var name = table.$order[i];
					rules.push(name + " <- " + table[name]);
				}
				return rules.join("\n");
			}
					
		}

		return table;
	},

	DefinitionToString: function() {
		var seq = [];
		for (var i = 0; i < this.length; i++) {
			seq.push(this[i].join(" "));
		}
		return seq.join(" / ");
	},
	Definition: function(identifier, leftarrow, pattern) {
		pattern.type = this.ID_PATTERN;
		pattern.toString = this.DefinitionToString;
		pattern.name = identifier;
		return pattern;
	},

	Pattern: function(sequence, alternatives) {
		var pattern = [sequence];
		for (var i = 0; i < alternatives.length; i++) {
			pattern.push(alternatives[i][1]);
		}
		return pattern;
	},
		
	Sequence: function(expressions) {
		return expressions;
	},
	
	Alternative: function(slash, sequence) {
		return sequence;
	},
	
	Expression: function(prefixOrPrimary, suffixOrPrimaryOrNull) {
		if (suffixOrPrimaryOrNull == null) {
			// primary only
			return prefixOrPrimary;
		} else if (prefixOrPrimary.type == this.ID_AND 
		           || prefixOrPrimary.type == this.ID_NOT)
		{
			// prefix
			prefixOrPrimary.primary = suffixOrPrimaryOrNull;
			return prefixOrPrimary;
		} else {
			// suffix
			suffixOrPrimaryOrNull.primary = prefixOrPrimary;
			return suffixOrPrimaryOrNull;
		}
	},
	
	Prefix: function(prefix) {
		return prefix;
	},

	Suffix: function(suffix) {
		return suffix;
	},

	PrimaryGroupToString: function() {
		return '(' + this._patternToString() + ')';
	},
	PrimaryGrabToString: function() {
		return '<' + this._patternToString() + '>';
	},
	Primary: function(primaryOrOpen, patternOrNull) {
		if (primaryOrOpen.type == this.ID_GROUP_OPEN) {
			patternOrNull.type = this.ID_PATTERN;
			patternOrNull.grab = false;
			patternOrNull._patternToString = this.DefinitionToString;
			patternOrNull.toString = this.PrimaryGroupToString;
			return patternOrNull;
		} else if (primaryOrOpen.type == this.ID_GRAB_OPEN) {
			patternOrNull.type = this.ID_PATTERN;
			patternOrNull.grab = true;
			patternOrNull._patternToString = this.DefinitionToString;
			patternOrNull.toString = this.PrimaryGrabToString;
			return patternOrNull;
		} else {
			return primaryOrOpen;
		}
	},
	
	IdentifierToString: function() {
		return this.string;
	},
	Identifier: function(str, spacing) {
		return {
			type: this.ID_IDENTIFIER,
			value: str.split(""),
			string: str,
			toString: this.IdentifierToString
		};
	},
	
	LiteralToString: function() {
		return this.quote 
			   + this.string.replace(new RegExp(this.quote, "g"), "\\" + this.quote)
							.replace(/\n/g, "\\n")
							.replace(/\r/g, "\\r")
							.replace(/\t/g, "\\t")
			   + this.quote;
	},
	Literal: function(quote, chars) {
		return {
			type: this.ID_LITERAL,
			value: chars,
			string: chars.join(""),
			quote: quote,
			toString: this.LiteralToString
		}
	},
	
	ClassToString: function() {
		return '[' + this.ranges.join("") + ']';
	},
	Class: function(lbrack, ranges) {
		return {
			type: this.ID_CLASS,
			ranges: ranges,
			toString: this.ClassToString
		}
	},
	
	RangeToString: function() {
		var low = this.low;
		var high = this.high;
		if (high) {
			return (this.esc[low] || low) + '-' + (this.esc[high] || high);
		} else {
			return (this.esc[low] || low);
		}
	},
	Range: function(low, dash, high) {
		return {
			type: this.ID_RANGE,
			low: low,
			high: high,
			esc: {
				'\n': '\\n',
				'\r': '\\r',
				'\t': '\\t',
				'[':  '\\[',
				']':  '\\]',
				'\\': '\\\\'
			},
			toString: this.RangeToString
		}
	},
	
	Char: function(chOrSlash, ch) {
		if (chOrSlash == '\\') {
			switch(ch) {
				case 'n': ch = '\n'; break;
				case 'r': ch = '\r'; break;
				case 't': ch = '\t'; break;
			}
			return ch;
		} else {
			return chOrSlash;
		}
	},
	
	ID_LEFTARROW: 7,
	LEFTARROW_NODE: {
		type: 7,
		toString: function() { return '<-' }
	},
	LEFTARROW: function() {
		return this.LEFTARROW_NODE;
	},

	ID_SLASH: 8,
	SLASH_NODE: {
		type: 8,
		toString: function() { return '/' }
	},
	SLASH: function() {
		return this.SLASH_NODE;
	},

	ID_AND: 9,
	AND: function() {
		return {
			type: this.ID_AND,
			primary: null, // will be filled in later
			toString: function() {
				return '&' + this.primary.toString();
			}
		}
	},

	ID_NOT: 10,
	NOT: function() {
		return {
			type: this.ID_NOT,
			primary: null, // will be filled in later
			toString: function() {
				return '!' + this.primary.toString();
			}
		}
	},

	ID_QUESTION: 11,
	QUESTION: function() {
		return {
			type: this.ID_QUESTION,
			primary: null, // will be filled in later
			toString: function() {
				return this.primary.toString() + '?';
			}
		}
	},
	
	ID_STAR: 12,
	STAR: function() {
		return {
			type: this.ID_STAR,
			primary: null, // will be filled in later
			toString: function() {
				return this.primary.toString() + '*';
			}
		}
	},

	ID_PLUS: 13,
	PLUS: function() {
		return {
			type: this.ID_PLUS,
			primary: null, // will be filled in later
			toString: function() {
				return this.primary.toString() + '+';
			}
		}
	},

	ID_GROUP_OPEN: 14,
	GROUP_OPEN_NODE: {
		type: 14,
		toString: function() { return '(' }
	},
	GROUP_OPEN: function() {
		return this.GROUP_OPEN_NODE;
	},

	ID_GROUP_CLOSE: 15,
	GROUP_CLOSE_NODE: {
		type: 15,
		toString: function() { return ')' }
	},
	GROUP_CLOSE: function() {
		return this.GROUP_CLOSE_NODE;
	},

	ID_GRAB_OPEN: 16,
	GRAB_OPEN_NODE: {
		type: 16,
		toString: function() { return '<' }
	},
	GRAB_OPEN: function() {
		return this.GRAB_OPEN_NODE;
	},

	ID_GRAB_CLOSE: 17,
	GRAB_CLOSE_NODE: {
		type: 17,
		toString: function() { return '>' }
	},
	GRAB_CLOSE: function() {
		return this.GRAB_CLOSE_NODE;
	},

	ID_DOT: 18,
	DOT_NODE: {
		type: 18,
		toString: function() { return '.' }
	},
	DOT: function() {
		return this.DOT_NODE;
	},
}

with (ParseExp.PEG_AST_BUILDER) {

	/* 
	 * What follows is a PEG describing the PEG syntax.  This is the grammar
	 * we use to parse PEGs.
	 *
	 * We have a bit of a bootstrapping issue here, though.  We'd like to parse the
	 * PEG using our PEG parser, but which comes first?  So instead, we'll describe
	 * the PEG grammar using a JavaScript-coded AST, and then use the AST to produce
	 * the PEG parser.  (In turn we can then validate our results by using the PEG
	 * parser to parse our canonical PEG and verify that its output AST matches the
	 * one we used to create the parser.  Chew on that for a bit.)
	 */
	
	function def(name, pattern1 /*, pattern2, ... */) {
		var patterns = [pattern1];
		for (var i = 2; i < arguments.length; i++) {
			patterns.push(arguments[i]);
		}
		return Definition(id(name), LEFTARROW(), patterns);
	}
	
	function id(name) {
		return Identifier(name);
	}
	
	function not(primary) {
		return Expression(NOT(), primary);
	}
	
	function plus(primary) {
		return Expression(primary, PLUS());
	}
	
	function star(primary) {
		return Expression(primary, STAR());
	}
	
	function question(primary) {
		return Expression(primary, QUESTION());
	}
	
	function groupPattern(pattern1 /*, pattern2, ...*/) {
		var patterns = [pattern1];
		for (var i = 1; i < arguments.length; i++) {
			patterns.push(arguments[i]);
		}
		return Primary(GROUP_OPEN(), patterns, GROUP_CLOSE());
	}

	function grabPattern(pattern1 /*, pattern2, ...*/) {
		var patterns = [pattern1];
		for (var i = 1; i < arguments.length; i++) {
			patterns.push(arguments[i]);
		}
		return Primary(GRAB_OPEN(), patterns, GRAB_CLOSE());
	}
	
	function _class(range1 /*, range2, ...*/) {
		var ranges = [range1];
		for (var i = 1; i < arguments.length; i++) {
			ranges.push(arguments[i]);
		}
		return Class('[', ranges, ']');
	}
	
	function range(low, high) {
		if (high) {
			return Range(low, '-', high);
		} else {
			return Range(low);
		}
	}
	
	function lit(str) {
		return Literal("'", str.split(""), "'");
	}
	
	function grammar(/* def1, def2, ... */) {
		return Grammar(null, arguments, null);
	}
	
	ParseExp.PEG_GRAMMAR = grammar(
		def("Grammar",     [id("Spacing"), plus(id("Definition"))]),
		def("Definition",  [id("Identifier"), id("LEFTARROW"), id("Pattern")]),

		def("Pattern",     [id("Sequence"), star(groupPattern([id("SLASH"), id("Sequence")]))]),

		def("Sequence",    [plus(id("Expression"))]),
		def("Expression",  [id("Prefix"),id("Primary")],
		                   [id("Primary"),question(id("Suffix"))]),
		def("Prefix",      [id("AND")],[id("NOT")]), 
		def("Suffix",      [id("QUESTION")],[id("STAR")],[id("PLUS")]),
		def("Primary",     [id("Identifier"), not(id("LEFTARROW"))],
						   [id("GROUP_OPEN"), id("Pattern"), id("GROUP_CLOSE")],
						   [id("GRAB_OPEN"), id("Pattern"), id("GRAB_CLOSE")],
						   [id("Literal")],
						   [id("Class")],
						   [id("DOT")]),

		def("Identifier",  [ grabPattern([id("IdentStart"), star(id("IdentCont"))]), 
		                     id("Spacing")
		                   ]),
		def("IdentStart",  [_class(range('a','z'),range('A','Z'),range('_'))]),
		def("IdentCont",   [id("IdentStart")],[_class(range('0','9'))]),
		def("Literal",     [ _class(range("'")), 
							 star(groupPattern([not(_class(range("'"))), id("Char")])),
							 _class(range("'")),
							 id("Spacing")
						   ],
						   [ _class(range('"')), 
							 star(groupPattern([not(_class(range('"'))), id("Char")])),
							 _class(range('"')),
							 id("Spacing")
						   ]),

		def("Class",       [ lit('['),
							 star(groupPattern([not(lit(']')), id("Range")])),
							 lit(']'),
							 id("Spacing")
						   ]),
		
		def("Range",       [id("Char"),lit('-'),id("Char")], [id("Char")]),
		def("Char",        [ lit('\\'), 
							 _class(range('n'),range('r'),range('t'),
								    range("'"),range('"'),range('['),
								    range(']'),range('\\'))
						   ],
						   [ not(lit('\\')), DOT() ]),

		def("LEFTARROW",   [lit('<-'), id("Spacing")]),
		def("SLASH",       [lit('/'),  id("Spacing")]),
		def("AND",         [lit('&')]),
		def("NOT",         [lit('!')]),
		def("QUESTION",    [lit('?'),  id("Spacing")]),
		def("STAR",        [lit('*'),  id("Spacing")]),
		def("PLUS",        [lit('+'),  id("Spacing")]),
		def("GROUP_OPEN",  [lit('('),  id("Spacing")]),
		def("GROUP_CLOSE", [lit(')'),  id("Spacing")]),
		def("GRAB_OPEN",   [lit('<'),  id("Spacing")]),
		def("GRAB_CLOSE",  [lit('>'),  id("Spacing")]),
		def("DOT",         [lit('.'),  id("Spacing")]),
		def("Spacing",     [ star(grabPattern([id("Space")], 
										       [id("Comment")]))
						   ]),

		def("Comment",     [ lit('#'), 
							 star(grabPattern([not(id("EndOfLine")), DOT()])),
							 id("EndOfLine")
						   ]),
	
		def("Space",       [lit(' ')], [lit('\t')], [id("EndOfLine")]),
		def("EndOfLine",   [lit('\r\n')], [lit('\n')], [lit('\r')])
	);
}

ParseExp.pegParser = new ParseExp(ParseExp.PEG_GRAMMAR, ParseExp.PEG_AST_BUILDER);