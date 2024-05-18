import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PGHOST'),
        database: configService.get<string>('PGDATABASE'),
        username: configService.get<string>('PGUSER'),
        password: configService.get<string>('PGPASSWORD'),
        port: configService.get<number>('PGPORT'),
        autoLoadEntities: true,
        synchronize: true,
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
