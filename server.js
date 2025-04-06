import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const port = process.env.PORT || 3000;
const user = process.env.USER;
const apiKey = process.env.API_KEY;

const args = process.argv.slice(2);
const providedUser = args.find((arg) => arg.startsWith('--user='))?.split('=')[1];
const providedKey = args.find((arg) => arg.startsWith('--apiKey='))?.split('=')[1];

if (providedUser !== user || providedKey !== apiKey) {
  console.error('❌ Feil brukernavn eller API-nøkkel');
  process.exit(1);
}

let server;
let attempt = 0;

function startServer(portToTry) {
  attempt++;
  try {
    const wss = new WebSocketServer({ port: portToTry });
    console.log(`🔌 WebSocket-server klar på port ${portToTry}`);

    wss.on('connection', (socket, req) => {
      const ip = req.socket.remoteAddress;
      console.log(`📡 Ny forbindelse fra ${ip}`);

      socket.on('message', (msg) => {
        console.log('📨 Melding mottatt:', msg.toString());
        socket.send(`Echo: ${msg}`);
      });

      socket.on('close', () => {
        console.log(`❌ Forbindelse fra ${ip} lukket.`);
      });
    });
  } catch (err) {
    if (err.code === 'EADDRINUSE') {
      const nextPort = portToTry + 1;
      if (attempt < 10) {
        console.log(`⚠️ Port ${portToTry} i bruk – prøver ${nextPort}`);
        startServer(nextPort);
      } else {
        console.error('❌ Ingen ledige porter tilgjengelig.');
        process.exit(1);
      }
    } else {
      throw err;
    }
  }
}

startServer(Number(port));
