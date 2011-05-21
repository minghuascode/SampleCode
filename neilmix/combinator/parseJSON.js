with(new Combinator()) {
	rule("E",         [select("e","E"), maybe(select("+","-"))]);
	rule("Digit",     range("0","9")),
	rule("Digit1to9", range("1","9")),
	rule("Digits",    plus(range("0","9")));
	rule("Exp",       [E(), Digits()]);
	rule("Frac",      [".", Digits()]);
	rule("Int",       select([Digit1to9(), maybe(Digits())], ["0", peek(not(Digit()))]));
	rule("Num",       slice([maybe('-'), Int(), maybe(Frac()), maybe(Exp())]));
	rule("Hex",       select(range('0','9'), range('a','f'), range('A','F')));
	rule("Strchars",  except(select('"', '\\')));
	rule("Unichar",   ['u', slice(repeat(Hex(), 4, 4))]);
	rule("Escape",    ['\\', select('"','\\','/','b','f','n','r','t', Unichar())]);
	rule("Chars",     plus(select(Strchars(), Escape())));
	rule("Str",       [omit('"'), Chars(), omit('"')]);
	rule("True",      "true");
	rule("False",     "false");
	rule("Null",      "null");
	rule("Value",     select($("Obj"), $("Arr"), True(), False(), Null(), Str(), Num()));
	rule("Arr",       [omit('['), list(Value(), ","), omit(']')]);
	rule("Obj",       [omit('{'), table(Str(), ":", Value(), ","), omit('}')]);
	
	output("Value", function(result) {
		switch(result) {
			case "true": return true; case "false": return false; case "null": return null;
			default: return result;
		}
	});
	output("Str", function(segments) { return segments.join(""); });
	output("Escape", function(backslash, c) {
		switch(c) {
			case 'b': return '\b'; case 'f': return '\f'; case 'n': return '\n';
			case 'r': return '\r'; case 't': return '\t';
			default: return c;
		}
	});
	output("Unichar", function(u, c) { return String.fromCharCode(parseInt(c, "16")); });
	output("Num",  function(num) { return Number(num); });
	output("Obj",  function(obj) { return obj });
	parseJSON = parser(select(Obj(), Arr()));
}