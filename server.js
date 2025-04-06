import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (socket, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`🟢 Tilkobling fra ${ip}`);

  socket.on('message', (msg) => {
    console.log('📨 Melding mottatt:', msg);
    socket.send(`Echo: ${msg}`);
  });

  socket.on('close', () => {
    console.log(`❌ Forbindelse fra ${ip} lukket.`);
  });
});

server.listen(PORT, () => {
  console.log(`🔌 WebSocket-server klar på port ${PORT}`);
});
