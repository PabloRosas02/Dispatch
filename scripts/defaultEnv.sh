#/bin/bash/sh

FILE_NAME=".env.example"

ENV_KEYS=(
  "# Node"
  "NODE_VERSION"
  "# NGROK"
  "NGROK_TOKEN"
)

> "$FILE_NAME"

for key in "${ENV_KEYS[@]}" ; do
  if [[ "$key" == \#* ]] ; then
    echo -e "\n$key" >> "$FILE_NAME"
  else
    echo "$key=" >> "$FILE_NAME"
  fi
done

