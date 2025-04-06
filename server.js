#!/usr/bin/env node

const WebSocket = require('ws');
const net = require('net');
const fs = require('fs');

// Finn ledig port automatisk
function getAvailablePort(start = 3000, end = 3999) {
  return new Promise((resolve) => {
    const tryPort = (port) => {
      if (port > end) throw new Error("Ingen ledig port");
      const tester = net.createServer()
        .once('error', () => tryPort(port + 1))
        .once('listening', () => {
          tester.close(() => resolve(port));
        })
        .listen(port);
    };
    tryPort(start);
  });
}

(async () => {
  const port = await getAvailablePort();
  fs.writeFileSync('port.txt', port.toString());
  console.log(`✅ WebSocket-server klar på port ${port} (skrevet til port.txt)`);

  const server = new WebSocket.Server({ port });

  server.on('connection', (socket, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`➡️  Tilkobling fra ${ip}`);
    socket.send('🎉 Du er koblet til WebSocket!');

    socket.on('message', (msg) => {
      console.log('📨 Melding mottatt:', msg);
      socket.send(`Echo: ${msg}`);
    });

    socket.on('close', () => {
      console.log(`❌ Forbindelse fra ${ip} lukket.`);
    });
  });
})();
