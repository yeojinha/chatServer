const cors = require('cors');
const express = require('express');
const app = express();
const WebSocket = require('wss');
const PORT = process.env.PORT || 3000
const expressWs = require('express-ws')(app)
app
  .use(epxress.json())
  .listen(PORT, ()=>console.log(`Listening on ${PORT}`))

app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// const wss = new WebSocket.Server({ server, path: '/ws' });

app.ws('/', (ws, req) => {
  // connection
  console.log('새로운 클라이언트 접속');
  ws.on('message', (message) => {
    // receiving message
    const json = JSON.parse(message.toString());
    json.time = Date.now()
    message = JSON.stringify(json)
    console.log(message.toString());
    expressWs.getWss().clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });

      // Runs when client disconnects
  ws.on('disconnect', () => {
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