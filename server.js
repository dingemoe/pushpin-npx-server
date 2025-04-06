// server.js
import { WebSocketServer } from 'ws';
import http from 'http';

// Hardkodet konfigurasjon - ingen miljøvariabler eller autentisering
const PORT = 5000;

function startServer(port) {
  const server = http.createServer();
  const wss = new WebSocketServer({ server });

  wss.on('connection', socket => {
    const ip = socket._socket.remoteAddress;
    console.log(`✅ Tilkoblet fra ${ip}`);

    socket.on('message', msg => {
      console.log('📨 Melding mottatt:', msg.toString());
      socket.send(`Echo: ${msg}`);
    });

    socket.on('close', () => {
      console.log(`❌ Forbindelse fra ${ip} lukket.`);
    });
  });

  server.listen(port, () => {
    console.log(`🔌 WebSocket-server klar på port ${port}`);
  });

  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} i bruk – prøver port ${port + 1}...`);
      startServer(port + 1);
    } else {
      throw err;
    }
  });
}

// Start serveren
startServer(PORT);
