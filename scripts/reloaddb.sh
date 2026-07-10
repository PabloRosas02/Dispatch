#/bin/bash/sh

docker compose --profile dev down -v
docker compose --profile dev up --build
