export const UBUNTU20_IMAGE_ID = 'ami-07d16c043aa8e5153';
export const FRONTEND_DOCKER_IMAGE_NAME = `deokam/react-nginx:1.1`;
export const FRONTEND_USER_DATA_SCRIPT = `#!/bin/bash
sudo apt-get update && upgrade

sudo -y apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

sudo mkdir -p /etc/apt/rings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/rings/docker.gpg 
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/rings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt -y install docker-ce docker-ce-cli containerd.io
sudo systemctl enable docker.service

sudo docker pull deokam/react-nginx:1.1
sudo docker run -d -p 80:80 --name react-test deokam/react-nginx:1.1
 `;
