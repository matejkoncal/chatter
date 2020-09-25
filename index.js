const WebSocket = require('ws');
const fs = require('fs');
const http = require('http');

myIP = require('my-ip');
console.dir(`Chat is running on http://${myIP()}/`);

http
	.createServer((req, resp) => {
		var request = req.url;
		if (request == '/' && req.headers.upgrade != 'websocket')
			fs.readFile('index.html', (e, data) => {
				resp.writeHead(200);
				resp.write(data);
				resp.end();
			});
	})
	.listen(80);

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
	wsGlobal = ws;
	ws.on('message', function incoming(message) {
		sendDataForAll(message);
	});
});

var sendDataForAll = (data) => {
	if (data) {
		wss.clients.forEach((ws) => {
			ws.send(data);
		});
	}
};
