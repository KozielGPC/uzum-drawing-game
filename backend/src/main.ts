import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    const port = process.env.PORT || 3333;
    await app.listen(port, () => {
        console.log('Server listening on port ' + port);
    });
}
bootstrap();
