// server.js
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import http from 'http';

dotenv.config();

const args = process.argv.slice(2);
const userArg = args.find(arg => arg.startsWith('--user='))?.split('=')[1];
const keyArg = args.find(arg => arg.startsWith('--apiKey='))?.split('=')[1];

const user = userArg || process.env.USER;
const apiKey = keyArg || process.env.API_KEY;
const PORT = parseInt(process.env.PORT || '3000', 10);

if (!user || !apiKey || user !== process.env.USER || apiKey !== process.env.API_KEY) {
  console.error('❌ Feil brukernavn eller API-nøkkel');
  process.exit(1);
}

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
      console.warn(`⚠️ Port ${port} i bruk – prøver ny...`);
      startServer(port + 1);
    } else {
      throw err;
    }
  });
}

startServer(PORT);
