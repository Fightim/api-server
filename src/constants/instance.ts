export const CENTOS_IMAGE_ID = 'ami-03bb74d9c8c575ec0';
export const UBUNTU20_IMAGE_ID = 'ami-0a74c05e1e3b13202';
export const NODE_CENTOS_IMAGE_ID = 'ami-07f334dabe4604359';
export const NODE_UBUNTU_IMAGE_ID = 'ami-055c5847c770c5345';
export const FRONTEND_DOCKER_IMAGE_NAME = `deokam/result-page:latest`;
export const BACKEND_DOCKER_IMAGE_NAME = `sdbwltns/capston:latest`;

export const BACKEND_UBUNTU_USER_DATA_SCRIPT = `#!/bin/bash
sudo docker run -d -p 80:80 --name backend ${BACKEND_DOCKER_IMAGE_NAME}`;

export const BACKEND_CENTOS_USER_DATA_SCRIPT = `#!/bin/bash
 sudo docker run -d -p 80:80 --name backend ${BACKEND_DOCKER_IMAGE_NAME}`;

export const FRONTEND_UBUNTU_USER_DATA_SCRIPT = `#!/bin/bash
sudo docker run -d -p 80:80 --name frontend ${FRONTEND_DOCKER_IMAGE_NAME}`;

export const FRONTEND_CENTOS_USER_DATA_SCRIPT = `#!/bin/bash
sudo docker run -d -p 80:80 --name frontend ${FRONTEND_DOCKER_IMAGE_NAME}`;

export const getUserScript = (repository: string) => {
  return `#!/bin/bash
git clone ${repository} app
cd app
npm install
npm run build
npm run start
`;
};
