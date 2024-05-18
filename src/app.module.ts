import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './movie/movie.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [AuthModule, MovieModule, CustomerModule],
})
export class AppModule {}
