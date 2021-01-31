#! /bin/bash

composeFile="docker-compose.yml";

if [ "$1" != "" ]; then
  pwd;
  echo "Working directory: ~/releases/$1";
  cd ~/releases/$1;
else
  composeFile="pipelines/docker-compose.yml";
fi;

envFile="$PWD/.env";

set -o allexport; source $envFile; set +o allexport;
docker pull "${IMAGE}:${BUILD_ID}";

pwd;
ls -la;

export ENV_FILE="${envFile}";

echo "IMAGE = ${IMAGE}";
echo "BUILD_ID = ${BUILD_ID}";
echo "STACK = ${STACK}";
echo "NAME = ${NAME}";
echo "URL = ${URL}";
echo "PORT = ${PORT}";
echo "ENV_FILE = ${ENV_FILE}";
echo "Compose file = ${composeFile}";

docker-compose -f $composeFile up -d 2>&1;
