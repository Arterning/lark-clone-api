import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateDocument } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置全局路由前缀
  app.setGlobalPrefix('api');

  // 创建swagger文档
  generateDocument(app);

  app.enableCors();

  app.enableShutdownHooks();
  await app.listen(3000);
  
}
bootstrap();
