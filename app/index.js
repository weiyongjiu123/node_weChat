var http = require('http');

var appIndex = require('./appIndex');

http.createServer(function (require,response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    if(require.method == 'GET')
    {
        appIndex.doGet(require,response);
    }else if(require.method == 'POST'){
        appIndex.doPost(require,response);
    }
}).listen(80);

