import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { Customer } from '../models/customer.interface';
import { CustomerService } from '../service/customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post('/create')
  createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Observable<Customer> {
    return from(this.customerService.createCustomer(createCustomerDto));
  }

  @Get()
  getAllCustomers() {
    return this.customerService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string): Observable<Customer> {
    return from(this.customerService.findOne(id));
  }

  @Delete('/delete/:id')
  deleteOne(@Param('id') id: string): Observable<any> {
    return from(this.customerService.deleteOne(id));
  }

  @Put('/:id')
  updateOne(
    @Param('id') id: string,
    @Body() createCustomerDto: CreateCustomerDto,
  ): Observable<any> {
    return from(this.customerService.updateOne(id, createCustomerDto));
  }
}
