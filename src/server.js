const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 9999;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });


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