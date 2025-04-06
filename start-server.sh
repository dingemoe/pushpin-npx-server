#!/bin/bash

if [[ $1 == "npx" ]]; then
  echo "🔄 Kjører npx-versjon..."
  node server.npx.js
else
  echo "🧪 Kjører lokalversjon med .env..."
  node server.local.js
fi
