import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InvoiceDto } from '../dto/invoice.dto';
import { InvoiceEntity } from '../models/invoice.entity';
import { InvoiceService } from '../service/invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Post('/create')
  createInvoice(@Body() invoiceDto: InvoiceDto): Promise<InvoiceEntity> {
    return this.invoiceService.createInvoice(invoiceDto);
  }

  @Get('/:id')
  findOne(@Param('id') id: string): Promise<InvoiceEntity> {
    return this.invoiceService.findOne(id);
  }

  @Get()
  findAll(): Promise<InvoiceEntity[]> {
    return this.invoiceService.findAll();
  }

  @Get('/customer/:id')
  findByCustomerId(@Param('id') id: string): Promise<InvoiceEntity[]> {
    return this.invoiceService.findByCustomerId(id);
  }

  @Delete('/:id')
  deleteOne(@Param('id') id: string): Promise<void> {
    return this.invoiceService.deleteOne(id);
  }
}
