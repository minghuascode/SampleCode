var fails = 0;

function testParse(func, expected) {
	var result = parseFunction(func);
	assertEquals(func.toString().replace(/\s+/g, ""), result.toString().replace(/\s+/g, ""));

	var output = ["", ""];
	treesToStrings(expected, result, output);
	assertEquals(output[0].replace(/\s+/g, ""), output[1].replace(/\s+/g, ""));
}

function testStmt(stmt, tree) {
	var func = new Function(stmt);
	return testParse(func, { 
		type:"function",
		params: [],
		body: {
			type:"block", statements: [
				stmt
			]
		}
	});
}

function testExpr(expr, tree) {
	var func = new Function(expr);
	return testParse(func, { 
		type:"function",
		params: [],
		body: {
			type:"block", statements: [
				{ type: "semicolon", expression: tree }
			]
		}
	});
}

function treesToStrings(expected, got, output) {
	if (expected && typeof(expected) == "object") {
		output[0] += "{";
		if (got) output[1] += "{";
		var count = 0;
		for (var n in expected) {
			if (count++) {
				output[0] += ",";
				if (got) output[1] += ",";
			}
			output[0] += n + ":";
			if (got) output[1] += n + ":";
			treesToStrings(expected[n], got?got[n]:null, output);
		}
		output[0] += "}";
		if (got) output[1] += "}";
	} else {
		if (expected) output[0] += expected;
		if (got) output[1] += got;
	}
}

function assertEquals(expected, received) {
	if (expected !== received)
		throw new Error("expected:\n  " + expected + "\ngot:\n  " + received +"\n");
}

function $(type, data) {
	data.type = type;
	return data;
}

function id(sym) {
	return $("identifier", sym);
}

function op(sym /*...*/) {
	var args = Array.prototype.slice.call(arguments, 1, arguments.length - 1);
	return $(sym, args);
}

load("jsparser.js");
try {
	testParse(
		function() {},
		{ type: "function", params: [], body: { type: "block", statements: [] } }
	);
	testExpr("foo = bar", { type: "=", left: "foo", right: "bar" });
	testExpr(
		"foo = bar + baz", 
		{ left: "foo", type: "=", right: { left: "bar", type: "+", right: "baz" } }
	);
	// right associative
	testExpr(
		"foo = bar = baz", 
		{ left: "foo", type: "=", right: { left: "bar", type: "=", right: "baz" } } 
	);
	// left associative
	testExpr(
		"foo + bar + baz", 
		{ left: { left: "foo", type: "+", right: "bar" }, type: "+", right: "baz" } 
	);
	testExpr(
		"foo++",
		{ operand: "foo", type: "++", post: true }
	);
	testExpr(
		"foo(bar, baz, bee)",
		{ operand: "foo", type: "call", args: ["bar", "baz", "bee"], post: true }
	);
	testExpr(
		"foo[x+y]",
		{ operand: "foo", type: "index", key: { left: "x", type: "+", right: "y" } }
	);
	testExpr(
		"!x",
		{ operand: "x", type: "!" }
	);
	testStmt(
		"if(foo) { bar; }",
		{ type: "if", condition: "foo", body: { type: "block" } }
	);
	
	if (fails == 0)
		print("all tests succeeded.");
	
} catch(e) {
	print(e.toString());
	print(e.stack);
}