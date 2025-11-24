import { Container } from 'inversify';
import { PrismaClient } from '@baker/database';
import { HealthController } from '../http/controllers/health.controller';
import { AuthController } from '../http/controllers/auth.controller';
import { FaqController } from '../http/controllers/faq.controller';
import { FaqService } from '../modules/faq/faq.service';
import { FaqRepository } from '../modules/faq/faq.repository';

const container = new Container();

const prisma = new PrismaClient();
container.bind(PrismaClient).toConstantValue(prisma);

// Controllers
container.bind(HealthController).toSelf();
container.bind(AuthController).toSelf();
container.bind(FaqController).toSelf();

// FAQ Module
container.bind(FaqRepository).toSelf();
container.bind(FaqService).toSelf();

export { container };

