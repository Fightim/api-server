import { DocumentBuilder } from '@nestjs/swagger';

export const appVersion = '1.0';

const description = `
The Cloud-GUI API description  
화이팀 API 서버 명세서입니다.  
개발 BaseUrl : http://52.79.126.134:3000/  
`;

export const swaggerConfig = new DocumentBuilder()
  .addServer('http://localhost:3000')
  .addServer('http://52.79.126.134:3000/')
  .setTitle('Cloud-GUI')
  .setDescription(description)
  .setVersion(appVersion)
  .build();
