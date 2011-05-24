//server.js the server code for duostack
var http = require('http');

var cnt=0;
var loopcnt=0;
var pathshown=false;
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  var ostr = 'Hello World from minghua on Duostack!\n';
  if ( ! pathshown) {
    ostr += "__dirname:  " + __dirname + "\n";
    ostr += "__filename: " + __filename + "\n";
    pathshown=true;
  }

  var q = require('url').parse(req.url);
          /* require('url').parse('/status?name=ryan')
             { href: '/status?name=ryan',
               search: '?name=ryan',
               query: 'name=ryan',
               pathname: '/status' }
           */
  if ( q.pathname.indexOf('/startloop') == 0 ) {
    setTimeout(loopfunc,1000);
  } else if ( q.pathname.indexOf('/showadmin') == 0 ) {
    ostr += "  __dirname:  " + __dirname + "\n";
    ostr += "  __filename: " + __filename + "\n";
    ostr += "  req method:  " + req.method + "\n";
    ostr += "  req url:     " + req.url + "\n";
    ostr += "  req headers: " + req.headers.toString() + "\n";
    var o = req.headers;
    for (var i in req.headers) {
      ostr += "             : " + 
              (typeof o[i]) + " " + i + " " + o[i] + "\n";
    }
  } else {
    cnt++;
  }
  ostr += "Times this page has been viewed:  " + cnt + "\n";
  var h=parseInt( loopcnt/3600);
  var m=parseInt( (loopcnt % 3600) / 60);
  var s=parseInt( (loopcnt % 60) );
  ostr += "Loops this page has run:          " + loopcnt + "\n";
  ostr += "                         " + h + " " + m + " " + s + "\n";
  res.end(ostr);
}).listen(8124, "127.0.0.1");

function loopfunc() {
  loopcnt++;
  setTimeout(loopfunc,1000);
};

console.log('Server running at http://127.0.0.1:8124/');

