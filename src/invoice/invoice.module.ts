import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { InvoiceController } from './controller/invoice.controller';
import { InvoiceEntity } from './models/invoice.entity';
import { InvoiceService } from './service/invoice.service';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity]), UsersModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
