load("js.js");

var errCount = 0;
function assertEquals(expected, received) {
	if (expected !== received) {
		print("FAIL: expected " + expected + ", got " + received);
		print(new Error().stack);
		errCount++;
	}
}

function testCall(value, func, args) {
	assertEquals(value, call(func, args));
}

function call(func, args) {
	func = js(eval(SCOPE), func);
	return func.apply(this, args);
}

var startTime = new Date().getTime();
try {
	
	// var, return, basic ops
	
	var f = js(eval(SCOPE), function(a,b) { 
		var c = 1, d = 2;
		return a + b + c + d;
	});
	assertEquals(15, f(4,8));
	assertEquals(16, f(4,9));
	
	testCall(15, function() {
		var x = 4, y = 5;
		x += y + 6;
		return x;
	});
	
	// right-association

	// use a string because FF parens the correct precedence for us
	var func = "function() { var x = 1, y = 1; x += y += 1; return ~; }";
	testCall(3, func.replace("~", "x"));
	testCall(2, func.replace("~", "y"));
	
	// return
	
	testCall(undefined, function() { return; });
	
	// if
	
	var f = js(eval(SCOPE), function(x) {
		if (x == 1)
			return 1;
		
		if(x == 2) {
			return 2;
		} else if(x == 3) {
			return 3;
		} else {
			return 4;
		}
	});
	assertEquals(1, f(1));
	assertEquals(2, f(2));
	assertEquals(3, f(3));
	assertEquals(4, f(4));
		
	// ops

	testCall(3,     function(a,b) { return a |   b; },   [1,2]);
	testCall(0,     function(a,b) { return a &   b; },   [1,2]);	
	testCall(4,     function(a,b) { return a <<  b; },   [1,2]);
	testCall(-1,    function(a,b) { return a >>  b; },   [-4,2]);
	testCall(1,     function(a,b) { return a >>> b; },   [-4,31]);
	testCall(6,     function(a,b) { return a ^   b; },   [5,3]);

	testCall(false, function(a,b) { return a ==  b; },   [1,2]);
	testCall(true,  function(a,b) { return a !=  b; },   [1,2]);
	testCall(false, function(a,b) { return a === b; },   [1,"1"]);
	testCall(true,  function(a,b) { return a !== b; },   [1,"1"]);
	testCall(true,  function(a,b) { return a <   b; },   [1,2]);
	testCall(true,  function(a,b) { return a <=  b; },   [2,2]);
	testCall(false, function(a,b) { return a >   b; },   [1,2]);
	testCall(true,  function(a,b) { return a >=  b; },   [2,2]);

	testCall(3,     function(a,b) { return a +   b; },   [1,2]);
	testCall(-1,    function(a,b) { return a -   b; },   [1,2]);
	testCall(2,     function(a,b) { return a *   b; },   [1,2]);
	testCall(.5,    function(a,b) { return a /   b; },   [1,2]);
	testCall(3,     function(a,b) { return a %   b; },   [3,4]);
	
	testCall(-4,    function() { return -4; });
	testCall(4,     function() { var x = 4; return +x; });
	testCall(8,    function() { var x = "4"; return +x + 4; });
	testCall(false, function() { return !1; });
	testCall(-5,   function() { return ~4; });

	testCall(undefined, function() { return void 5; });
	testCall(true,      function() { test_delete = 5; return delete test_delete; });
	testCall("number",  function() { return typeof 5; });

	testCall(3,     function(x)   { return x.foo; },            [{foo: 3}]);
	testCall(3,     function(x)   { return x.foo.bar; },        [{foo: { bar: 3 }}]);
	testCall(3,     function(x,y) { return x[y]; },             [{foo: 3}, "foo"]);
	testCall(true,  function(a,b) { return a in  b; },          ["foo", {foo:1}]);
	testCall(true,  function(a,b) { return a instanceof b; },   [{}, Object]);

	testCall(3,     "function() { var x = 1; return ++x + 1; }");

	testCall(2,     function() { var x = 1; return x++ + 1; });

	testCall(1,     "function() { var x = 1; return --x + 1; }");

	testCall(2,     function() { var x = 1; return x-- + 1; });

	testCall(3,     function() { var x = 1; x +=    2;  return x; });
	testCall(-1,    function() { var x = 1; x -=    2;  return x; });
	testCall(2,     function() { var x = 1; x *=    2;  return x; });
	testCall(.5,    function() { var x = 1; x /=    2;  return x; });
	testCall(3,     function() { var x = 7; x %=    4;  return x; });
	testCall(3,     function() { var x = 1; x |=    2;  return x; });
	testCall(0,     function() { var x = 1; x &=    2;  return x; });
	testCall(4,     function() { var x = 1; x <<=   2;  return x; });
	testCall(1,     function() { var x = 4; x >>=   2;  return x; });
	testCall(1,     "function() { var x = -1; x >>>= 31; return x; }");

	// logical or/and
	
	var f = js(eval(SCOPE), function(a,b,c) {
		return a || b || c;
	});
	assertEquals(1, f(1,2,3));
	assertEquals(2, f(0,2,3));
	assertEquals(3, f(0,0,3));
	assertEquals(1, f(1,0,3));
	assertEquals(0, f(0,0,0));
	assertEquals(0, f(false,false,0));
	assertEquals(false, f(0,0,false));
	
	var f = js(eval(SCOPE), function(a,b,c) {
		return a && b && c;
	});
	assertEquals(3, f(1,2,3));
	assertEquals(0, f(1,2,0));
	assertEquals(0, f(1,0,3));
	assertEquals(0, f(0,2,3));

	var f = js(eval(SCOPE), function(a,b,c,d) {
		return a && b || c && d;
	});
	assertEquals(0, f(1,0,3,0));
	assertEquals(4, f(1,0,3,4));
	assertEquals(2, f(1,2,3,4));

	// conditionals
	
	var f = js(eval(SCOPE), function(a,b,c) {
		return a ? b : c;
	});
	assertEquals(2, f(1,2,3));
	assertEquals(3, f(0,2,3));
	
	var f = js(eval(SCOPE), function(x,y, z) { 
		return x ? y ? z ? 1 : 2 : 3 : 4; 
	});
	assertEquals(4, f(0,0,0));
	assertEquals(4, f(0,1,0));
	assertEquals(2, f(1,1,0));
	assertEquals(3, f(1,0,0));
	assertEquals(4, f(0,0,1));
	assertEquals(4, f(0,1,1));
	assertEquals(1, f(1,1,1));
	assertEquals(3, f(1,0,1));

	var f = js(eval(SCOPE), function(x,y) { 
		return x ? 1 : y ? 2 : 3; 
	});
	assertEquals(3, f(0,0));
	assertEquals(2, f(0,1));
	assertEquals(1, f(1,1));
	assertEquals(1, f(1,0));
	
	// function calls
	
	var join = function() {
		return Array.prototype.join.apply(arguments);
	}
	testCall("1,2,3", function() { return join(1,2,3) });
	testCall("", function() { return join() });
	testCall("1", function(x,y) { return join(x || y); }, [0,1]);
	testCall("2", function(x,y) { return join(x && y); }, [1,2]);
	//TODO: testCall("xy", function(x,y) { return arguments[0] + arguments[1]; });
	
	var x = { join: join };
	testCall("1", function() { return x.join(1) });
	testCall("1,23", function() { return x.join(1,2) + 3; });
	
	function Obj(x) {
		this.foo = x;
	}
	testCall(5, function() { return new Obj(5).foo; });
	
	var f = js(eval(SCOPE), function() { return this.foo; });
	assertEquals(5, f.call({foo: 5}));
	
	testCall(5, function() { return (function() { return 5 })(); });
	
	// complex operands

	testCall(5, function() { var f = function() { return 5; }; return f(); });

	testCall("1,2,3", "function() { return [1,2,3].join() }");

	var f = js(eval(SCOPE), "function() { return { foo: 2, 'bar': 1 }; }");
	var o = f();
	assertEquals(2, o.foo);
	assertEquals(1, o.bar);

	testCall("foo\"bar'baz", 'function() { return "foo\\"bar\'baz"; }');
	testCall("foo\"bar'baz", 'function() { return \'foo\\"bar\\\'baz\'; }');

	testCall("/foo/", "function() { return /foo/.toString(); }");
	
	testCall(3, function() { return 1, 2, 3; });
	testCall(3, function() { return (1, 2, 3); });
	testCall(3, "function(x,y) { return (x + y) / 2; }", [2,4]);
	
	// verify vars can be used before their declaration
	testCall("foo", function() { testvaruse = "foo"; var testvaruse; return testvaruse; });
	assertEquals("undefined", typeof(testvaruse));

	// while
	
	var f = js(eval(SCOPE), function(x) {
		var y = 0;
		while (x < 5) {
			x += 1;
			y += 1;
		}
		return y;
	});
	assertEquals(5, f(0));
	assertEquals(0, f(5));
	assertEquals(3, f(2));

	// while / break
	
	testCall(2, function() { 
		var x = 0; 
		while (x < 10) { 
			x++; 
			while (x < 10) {
				x++;
				break;
				x++;
			}
			break; 
			x++; 
		} 
		return x; 
	});
	
	testCall(2, function() {
		var x = 0;
		foo: bar: while (x < 10) {
			x++;
			while (x < 10) {
				x++;
				break foo;
				x++;
			}
			x++;
		}
		return x;
	});

	testCall(2, function() {
		foo: while (true) {
			bar: while (true) {
				baz: while(true) {
					break bar;
					return 0;
				}
				return 1;
			}
			return 2;
		}
		return 3;
	});
	
	// while / continue
	
	testCall(10, function() {
		var x = 0;
		while (x < 10) {
			x++;
			continue;
			return 0;
		}
		return x;
	});
	
	testCall(10, function() {
		var x = 0;
		foo: while (true) {
			bar: while(x < 10) {
				baz: while (true) {
					x++;
					continue bar;
					return 0;
				}
				return 1;
			}
			return x;
		}
		return 3;
	});
	
	// do-while
	
	testCall(10, function() {
		var x = 0;
		do {
			x++;
		} while (x < 10)
		return x;
	});
	
	testCall(5, function() {
		foo: do {
			bar: do {
				do {
					do {
						break;
					} while (true)
					break bar;
				} while (true)
			} while (true)
			return 5;
		} while (true)
	});

	testCall(20, function() {
		var x = 0;
		foo: do {
			bar: do {
				do {
					do {
						x++;
						continue;
					} while (x < 10)
					continue bar;
				} while (true)
			} while (x < 20)
			return x;
		} while (true)
	});

	// for
	
	testCall(10, function() {
		for (var i = 0; i < 10; i++);
		return i;
	});
		
	testCall("10,0", function() {
		for (var i = 0, j = 0; i < 10; i++) {
			continue;
			j++;
		}
		return i + "," + j;
	});
	
	testCall(5, function() {
		for (var i = 0; i < 10; i++) {
			if (i == 5) break;
		}
		return i;
	});

	// test "in" ambiguity resolution
	var obj = { foo: true };
	testCall(5, function() {
		for (var i = false ? "foo" in obj : 0; i < 10; i++) {
			if (i == 5) break;
		}
		return i;
	});

	testCall(5, "function() {\
		for (var i = ('blah' in obj) || 0; i < 10; i++) {\
			if (i == 5) break;\
		}\
		return i;\
	}");

	testCall(5, function() {
		var i;
		for(i = 0;i < 5;i++);
		return i;
	});
	
	testCall(5, function() {
		var i = 0;
		for(;i < 5;i++);
		return i;
	});

	testCall(5, function() {
		var i = 0;
		for(;;i++) if (i == 5) return i;
	});

	testCall(5, function() {
		var i = 0;
		for(;;) {
			i++;
			if (i == 5) return i;
		}
	});
	
	// for-in

	var obj = { foo: 1, bar: 2, baz: 3 };

	testCall(6, function(obj) { 
		var i = 0; 
		for(var n in obj) {
			i += obj[n]; 
		}
		return i;
	}, [obj]);
	
	testCall(6, function(obj) { 
		var i = 0, n; 
		for(n in obj) {
			i += obj[n]; 
		}
		return i;
	}, [obj]);

	// this is a dumb use-case, but the spec allows it.  :(
	testCall(6, "function(obj) { \
		var i = 0; \
		for(var n = true ? \'foo\' in obj : false in obj) {\
			i += obj[n]; \
		}\
		return i;\
	}", [obj]);
	
	// switch

	testCall(5, "function() { switch(5) { } return 5; }");

	// TODO: find and fix spidermonkey bug for this test case
	testCall(6, "function() { switch(5) { default: return 6; } }");
	
	testCall(2, "function() { switch(5) { case 4: return 1; } return 2; }");

	var f = js(eval(SCOPE), function(x) {
		var retval;
		switch(x) {
			case 1: case 2:
				retval = 1;
				break;
			case 3: default:
				retval = 2;
				break;
			case 4: case 5:
				retval = 3;
			case 6:
				retval = 4;
				break;
			case 7:
				return 5;
		}
		return retval;
	});

	assertEquals(1, f(1));
	assertEquals(1, f(2));
	assertEquals(2, f(3));
	assertEquals(4, f(4));
	assertEquals(4, f(5));
	assertEquals(4, f(6));
	assertEquals(5, f(7));
	
	// throw
	
	var ex = null;
	try {
		call(function() {throw "foo"});
	} catch(e) {
		ex = e;
	}
	assertEquals("foo", ex);
	
	// try/catch/finally
	
	var f = function(b) {
		try {
			if (b) throw new Error("exception test failed");
		} catch(e) {
			return 1;
		}
		return 2;
	}
	testCall(1, f, [true]);
	testCall(2, f, [false]);
	
	testCall("foo", function() {
		try {
			throw "foo";
		} catch(e) {
			return e;
		}
	});
	
	var f = function(b) {
		var x = 0;
		try {
			if (b) throw new Error("exception test failed");
		} catch(e) {
			x++;
		} finally {
			x++;
		}
		return x;
	}
	testCall(2, f, [true]);
	testCall(1, f, [false]);
	
	testCall(1, function() {
		x = 1;
		try {
			return x;
		} finally {
			x++;
		}
	});
	assertEquals(2, x);

	testCall(1, function() {
		x = 1;
		try {
			throw "foo";
		} catch (e) {
			return x;
		} finally {
			x++;
		}
	});
	assertEquals(2, x);

	testCall(5, function() {
		var x = 0;
		for (var i = 0; i < 5; i++) {
			try {
				continue;
			} finally {
				x++;
			}
		}
		return x;
	});
	
	testCall(1, function() {
		x = 0;
		try {
			try {
				throw new Error("should have been caught");
			} finally {
				x++;
			}
		} catch(e) {
		}
		return x;
	});
	
	testCall(1, function() {
		var x = 0;
		LOOP: for (var i = 0; i < 10; i++) {
			try {
				continue;
			} finally {
				for (var j = 0; j < 10; j++) {
					try {
						break LOOP;
					} finally {
						x = 1;
					}
				}
				x = 2;
			}
		}
		return x;
	});

	testCall(0, function() {
		x = 0;
		try {
			try {
				return x;
			} finally {
				x++;
			}
		} finally {
			x++;
		}
	});
	assertEquals(2, x);

	testCall("121212", function() {
		x = "";
		for (var i = 0; i < 3; i++) {
			try {
				continue;
			} finally {
				for (var j = 0; j < 10; j++) {
					try {
						break;
					} finally {
						x += "1";
					}
				}
				x += "2";
			}
		}
		return x;
	});
	
	testCall(1, function() {
		x = 0;
		try {
			try {
				throw "foo";
			} catch(e2) {
				throw e2;
			} finally {
				x++;
			}
		} catch (e1) {
			return x;
		} finally {
			x++;
		}
	});
	assertEquals(2, x);

	var f = function(x, y) {
		with (x) {
			with (y) {
				return [x.foo, y.foo, foo].join();
			}
		}
	}
	
	foo = 1;
	testCall(",,1",   f, [{ },        { }]);
	testCall("2,,2",  f, [{ foo: 2 }, { }]);
	testCall(",3,3",  f, [{ },        { foo: 3 }]);
	testCall("2,3,3", f, [{ foo: 2 }, { foo: 3 }]);

	var f = function(x, y) {
		with (x) {
			with (y) {
				var foo = 4;
				return [x.foo, y.foo, foo].join();
			}
		}
	}

	foo = 1;
	testCall(",,4",   f, [{ },        { }]);
	testCall("4,,4",  f, [{ foo: 2 }, { }]);
	testCall(",4,4",  f, [{ },        { foo: 3 }]);
	testCall("2,4,4", f, [{ foo: 2 }, { foo: 3 }]);
	
	// generators
	
	var makeCounter = js(eval(SCOPE), function() {
		var i = 0;
		while(true) {
			yield(i++);
		}
	});

	var c = makeCounter();
	assertEquals(0, c.next());
	assertEquals(1, c.next());
	assertEquals(2, c.next());
	assertEquals(3, c.next());
	
	var makeAdder = js(eval(SCOPE), function(i) {
		while(true) {
			i += yield(i);
		}
	});
	
	var a = makeAdder(0);
	assertEquals(0, a.next());
	assertEquals(2, a.send(2));
	assertEquals(7, a.send(5));
	assertEquals(6, a.send(-1));
	assertEquals(0, a.send(-6));

	var s = "";
	var f = js(eval(SCOPE), function(max) {
		s += "0";
		yield(0);
		s+= "1";
		for (var i = 2; i < max; i++) {
			s += i;
			yield(i);
		}
		s += ".";
	});
	
	var gen = f(10);
	assertEquals(0, gen.next());
	var i = 2;
	try {
		while(i <= 10) {
			assertEquals(i, gen.next());
			i++;
		}
	} catch(e) {
		if (e != StopIteration) throw e;
	}
	assertEquals(s, "0123456789.");

	// ------------------------------------
	//            bug tests
	// ------------------------------------

} catch(e) {
	errCount++;
	print(e.toString());
	print(e.stack);
}

if (errCount == 0) {
	print("all tests succeeded");
}

print("Total time: " + (new Date().getTime() - startTime));
