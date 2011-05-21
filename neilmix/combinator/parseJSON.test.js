load("Combinator.js");
load("parseJSON.js");
load("parseJSONRegExp.js");
load("json.js");

var errors = 0;
function test(obj) {
	var str = obj.toJSONString();
	if (parseJSON(str).toJSONString() != str) {
		errors++;
		print("expected " + str + ", got " + parseJSON(str).toJSONString());
		print(new Error().stack);
	}

	if (parseJSONRegExp(str).toJSONString() != str) {
		errors++;
		print("RegExp: expected " + str + ", got " + parseJSONRegExp(str).toJSONString());
		print(new Error().stack);
	}
}

try {
	test({});
	test({foo: "bar"});
	test([1, -2,5e100, 5.5,5.5e100, -5.5e100, -5.5e-100, -5.5E-100]);
	test([true,false,null,"blah"]);
	test({foo:["bar",5,null],bar:{blah:"blee"}});
	test([{foo:"bar"},["baz","blah"]]);

	print("All tests succeeded");
} catch(e) {
	print(e);
	print(e.stack);
}