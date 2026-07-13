#/bin/bash/sh

docker compose --profile dev down
docker volume rm kinsfolk_backend_db_dev
docker compose --profile dev up --build
