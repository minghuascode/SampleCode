load("ParseExp.js");

if (typeof(readFile) == "undefined") {
	function readFile(file) {
		return snarf(file);
	}
}

var pegText = readFile("ParsingExpressionGrammar.peg");
var parser = new ParseExp(pegText, ParseExp.PEG_AST_BUILDER);


var a = ParseExp.PEG_GRAMMAR.toString();
var b = parser.grammar.toString();
//print(a, b);
print(a == b);
print(ParseExp.pegParser.getParseStats());

var c = parser.parse("Grammar", pegText).toString();
print(b == c);
print(parser.getParseStats());

var parser = new ParseExp(readFile("xml.peg"));
var ast = parser.parse("Document", readFile("xmldata.xml"));
print(parser.getParseStats());
//print(ast);
