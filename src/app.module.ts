import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './movie/movie.module';
import { CustomerModule } from './customer/customer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { redisStore } from 'cache-manager-redis-store';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_HOST: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
      }),
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: 60,
        max: 10,
        store: redisStore as unknown as CacheStore,
        socket: {
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: configService.getOrThrow<string>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    MovieModule,
    CustomerModule,
    DatabaseModule,
  ],
})
export class AppModule {}
