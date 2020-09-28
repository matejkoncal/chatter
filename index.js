const WebSocket = require('ws');
const fs = require('fs');
const https = require('https');
const options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem'),
};

// myIP = require('my-ip');
// console.dir(`Chat is running on https://${myIP()}/`);

var server = https
	.createServer(options, (req, resp) => {
		console.log(req);
		var request = req.url;
		if (request == '/' && req.headers.upgrade != 'websocket')
			fs.readFile('index.html', (e, data) => {
				resp.writeHead(200);
				resp.write(data);
				resp.end();
			});
	})
	.listen();

const wss = new WebSocket.Server({ server });

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
