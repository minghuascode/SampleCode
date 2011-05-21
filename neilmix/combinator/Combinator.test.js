load("Combinator.js");
load("json.js");

with (new Combinator()) {
	function pass(p, text, expected) {
		p = parser(p);
		try {
			var result = p(text);
		} catch(e) {
			throw new Error("parse should have succeeded");
		}
		
		if (result && typeof(result) == "object")
			result = result.toJSONString();

		if (expected == null) {
			expected = text;
		} else if (expected && typeof(expected) == "object") {
			expected = expected.toJSONString();
		}
		
		if (expected != result) {
			throw new Error("output mismatch, expected " + expected + ", got " + result);
		}
	}
	
	function equals(p, text, expected) {
		var result = parser(p)(text);
		if (expected != result) {
			throw new Error("expected " + expected + ", got " + result);
		}
	}
	
	function fail(p, text) {
		p = parser(p);
		try {
			p(text);
		} catch(e) {
			return;
		}
		throw new Error("parse should have failed");
	}
	
	try {
		// ch
		pass("c", "c");
		pass(true, ".");
		fail("c", "d");
		
		// range
		rule("Lower", range("a", "z"));
		pass(Lower(), "a");
		pass(Lower(), "m");
		pass(Lower(), "z");
		fail(Lower(), "`");
		fail(Lower(), "A");
		
		// symbol
		rule("Token", "token");
		pass(Token(), "token");
		fail(Token(), "toke.");
		fail(Token(), ".oken");
				
		// repeat
		rule("Repeat", repeat("c", 3, 5));
		pass(Repeat(), "ccc", ["c","c","c"]);
		pass(Repeat(), "cccc", ["c","c","c","c"]);
		pass(Repeat(), "ccccc", ["c","c","c","c","c"]);
		fail(Repeat(), "cc");
		fail(Repeat(), "cccccc");
		
		// star
		rule("Star", star("c"));
		pass(Star(), "ccc", ["c","c","c"]);
		pass(Star(), "", []);
		fail(Star(), "cccd");
		
		// plus
		rule("Plus", plus("c"));
		pass(Plus(), "c", ["c"]);
		pass(Plus(), "ccccc", ["c","c","c","c","c"]);
		fail(Plus(), "");
		fail(Plus(), "ccccd");
		
		// maybe
		rule("Maybe", [maybe("c"), maybe("d")]);
		pass(Maybe(), "c", ["c",  null]);
		pass(Maybe(), "",  [null, null]);
		pass(Maybe(), "d", [null, "d"]);
		
		// sequence
		rule("Sequence", ["c", "d", "e"]);
		pass(Sequence(), "cde", ["c", "d", "e"]);
		fail(Sequence(), "ced");
		
		// select
		rule("Select", select("c", "d", "e"));
		pass(Select(), "c");
		pass(Select(), "d");
		pass(Select(), "e");
		fail(Select(), "f");

		// peek
		rule("Peek", [peek("c"), true]);
		pass(Peek(), "c", null);
		fail(Peek(), "d");
		
		// not
		rule("Not", not("c"));
		pass(Not(), "d");
		fail(Not(), "c");
		
		// omit
		rule("Omit", [omit("c"), "d"]);
		pass(Omit(), "cd", "d");
		fail(Omit(), "d");
		fail(Omit(), "ccd");
		
		// slice
		rule("Slice", slice(["c", "d", "e"]));
		pass(Slice(), "cde");
		fail(Slice(), "ced");
		
		// except
		rule("Except", except("c"));
		pass(Except(), "d");
		fail(Except(), "c");

		// list
		rule("List", list("c", ","));
		pass(List(), "", []);
		pass(List(), "c", ["c"]);
		pass(List(), "c,c", ["c","c"]);
		pass(List(), "c,c,c,c,c,c", ["c","c","c","c","c","c"]);
		fail(List(), ",c,c");
		fail(List(), "c,,c,c");
		fail(List(), "c,c,c,d");
		fail(List(), "c,c,c,");
		
		// table
		rule("Table", table(range("a","z"), ":", range("a","z"), ","));
		output("Table", function(res) { return res; });
		pass(Table(), "", {});
		pass(Table(), "c:d", {c: "d"});
		pass(Table(), "c:d,e:f", {c:"d",e:"f"});
		pass(Table(), "c:d,e:f,g:h,i:j", {c:"d",e:"f",g:"h",i:"j"});
		fail(Table(), ",c:d,c:d");
		fail(Table(), "c:D,c:E");
		fail(Table(), "c:,c:d,c:d");
		fail(Table(), "c:d,,c:d");
		fail(Table(), "c:d,,c:d");
		fail(Table(), "c:d,:d,c:d");
		fail(Table(), "c:d,c:d,c:d,");
		fail(Table(), "c:d,c:d,c:d,c:");

		// $
		rule("First", $("Second"));
		rule("Second", "c");
		pass(First(), "c");
		pass(First(), "c");
		fail(First(), "d");
		
		// combinations
		pass(slice(star(select(except(","), ",,"))), 'a,,');
		equals(slice([symbol("foo"), "."]), "foo.", "foo.");
		
		print("All tests succeeded");
	} catch(e) {
		print("\n\nFAIL: " + e);
		print(e.stack);
	}
}