#/bin/bash/sh

docker compose --profile dev down
docker volume rm kinsfolk_backend_db
docker compose --profile dev up
