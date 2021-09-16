import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceController } from './controller/invoice.controller';
import { InvoiceEntity } from './models/invoice.entity';
import { InvoiceService } from './service/invoice.service';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
