import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'prisma/@generated';
import { logger } from 'src/utils/logger';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect()
            .then(() => {
                logger.info('Prisma connected');
            })
            .catch((e) => {
                logger.error('Error connecting to prisma: ' + e);
            });
    }

    async enableShutdownHooks(app: INestApplication) {
        process.on('beforeExit', () => {
            app.close();
        });
    }
}
