import { DocumentBuilder } from '@nestjs/swagger';

export const appVersion = '1.0';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Cloud-GUI')
  .setDescription('The Cloud-GUI API description')
  .setVersion(appVersion)
  .build();
