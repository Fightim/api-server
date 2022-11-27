import { DocumentBuilder } from '@nestjs/swagger';

export const appVersion = '1.0';

const description = `
The Cloud-GUI API description  
화이팀 API 서버 명세서입니다.  
개발 BaseUrl : http://causeapiserver-env.eba-pegczwgz.ap-northeast-2.elasticbeanstalk.com/api-docs/  
`;

export const swaggerConfig = new DocumentBuilder()
  .addServer('http://localhost:3000')
  .addServer(`https://dev.cloud-gui.com`)
  .setTitle('Cloud-GUI')
  .setDescription(description)
  .setVersion(appVersion)
  .addBearerAuth()
  .build();
