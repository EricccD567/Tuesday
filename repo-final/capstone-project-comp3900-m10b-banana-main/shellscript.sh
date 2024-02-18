#!/bin/sh
#ssh-keygen -t ed25519 -C "tshabih13@gmail.com"
sudo apt-get update
# Install Chromium
sudo apt install -y chromium-browser

# install gnome
sudo apt install ubuntu-desktop-minimal

# pip install requirements
sudo apt install python3-pip
pip3 install --upgrade pip==22.2.2
sudo apt install python3-testresources
sudo apt install python3-flask
sudo apt-get install python-dateutil
pip3 install pip --upgrade
pip3 install pyopenssl --upgrade
pip3 install -r requirements.txt

# Curl command for nvm
gnome-terminal --tab -e "bash curl_install.sh"

# Download node and nvm
gnome-terminal --tab -e "bash node_install.sh"

# run the 2 gnome terminals for frontend and backend
gnome-terminal --tab -e "bash backend_script.sh" --tab -e "bash frontend_script.sh"
