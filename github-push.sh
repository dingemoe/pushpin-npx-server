#!/bin/bash

# Git kommandoer for å laste opp alt til GitHub
git add .
git commit -m "♻️ Full oppdatering med .env, CLI-støtte og automatisk port"
git push

echo "✅ Alt er lastet opp til GitHub!" 

echo "Tester pushpin-npx-server"

npx github:dingemoe/pushpin-npx-server --user=dingemoe --apiKey=a93b48fa13e8bd7e243fabecf3b4a62e

