import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './movie/movie.module';
import { CustomerModule } from './customer/customer.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, MovieModule, CustomerModule],
})
export class AppModule {}
