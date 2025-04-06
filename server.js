#!/usr/bin/env node

require('dotenv').config();
const WebSocket = require('ws');
const net = require('net');
const fs = require('fs');

const VALID_USER = process.env.USER;
const VALID_KEY = process.env.API_KEY;

const args = Object.fromEntries(
  process.argv
    .filter(arg => arg.includes('='))
    .map(arg => arg.split('=').map(v => v.trim().replace(/^--/, '')))
);

const user = args.user;
const apiKey = args.apiKey;

// ✅ Autentisering
if (!user || !apiKey || user !== VALID_USER || apiKey !== VALID_KEY) {
  console.error('❌ Ugyldig bruker eller API-nøkkel. Bruk: --user=<USER> --apiKey=<KEY>');
  process.exit(1);
}

// 🚀 Finn ledig port
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
  console.log(`✅ Autentisert som ${user}. WebSocket kjører på port ${port}`);

  const server = new WebSocket.Server({ port });

  server.on('connection', (socket, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`➡️  Tilkobling fra ${ip}`);
    socket.send(`🎉 Velkommen ${user}! Du er koblet til WebSocket!`);

    socket.on('message', (msg) => {
      console.log(`[${user}] 📨: ${msg}`);
      socket.send(`Echo: ${msg}`);
    });

    socket.on('close', () => {
      console.log(`❌ Forbindelse fra ${ip} lukket.`);
    });
  });
})();
