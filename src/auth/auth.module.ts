import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from './jwt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../database/entities/customer.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<string>('JWT_EXPIRATION')}s`,
          algorithm: 'HS512',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AuthModule {}
