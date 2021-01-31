#! /bin/bash

remoteFolder="$BUILD_ID/$STACK/";
mkdir -p $remoteFolder;

cp -r artifacts/pipelines/* $remoteFolder;

envsubst < artifacts/environment/.env.example > $remoteFolder/.env;

remoteDir="~/releases/$NAME";

ssh $SSH_CONNECTION "mkdir -p $remoteDir";
scp -r $BUILD_ID $SSH_CONNECTION:$remoteDir;
