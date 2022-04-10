const cors = require('cors');
const express = require('express');
const app = express();
const WebSocket = require('wss');
const PORT = process.env.PORT || 9999;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const server = app.listen(PORT, () => {
  console.log(PORT, '번 포트에서 대기중');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});


const wss = new WebSocket.Server({ server, path: '/wss' });

wss.on('connection', (ws, req) => {
  // connection
  console.log('새로운 클라이언트 접속');
  ws.on('message', (message) => {
    // receiving message
    const json = JSON.parse(message.toString());
    json.time = Date.now()
    message = JSON.stringify(json)
    console.log(message.toString());
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });

      // Runs when client disconnects
  wss.on('disconnect', () => {
  });
  });
  ws.on('error', (err) => {
    // error 
    console.error(err);
  });
  ws.on('close', () => {
    // close
    console.log('Client close');
    clearInterval(ws.interval);
  });
});