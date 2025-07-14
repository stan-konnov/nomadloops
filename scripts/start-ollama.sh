#!/bin/sh

set -e

ollama serve &

until curl -s -o /dev/null http://localhost:11434/; do
  echo "Waiting for Ollama…"
  sleep 1
done

echo "Pulling model: $LLM_MODEL_ID"
curl -s -X POST http://localhost:11434/api/pull -d "{\"name\": \"$LLM_MODEL_ID\"}"

echo "Model pulled — keeping server running"
wait