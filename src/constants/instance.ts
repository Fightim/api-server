export const CENTOS_IMAGE_ID = 'ami-03bb74d9c8c575ec0';
export const UBUNTU20_IMAGE_ID = 'ami-0a74c05e1e3b13202';
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
