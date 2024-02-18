#!/bin/sh
# Download node and nvm
sudo apt-get install -y nodejs
cd frontend
npm install
sudo sysctl -w fs.inotify.max_user_watches=524288
exit
