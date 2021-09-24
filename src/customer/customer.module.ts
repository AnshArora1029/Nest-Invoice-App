import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { CustomerController } from './controller/customer.controller';
import { CustomerEntity } from './models/customer.entity';
import { CustomerService } from './service/customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity]), UsersModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
