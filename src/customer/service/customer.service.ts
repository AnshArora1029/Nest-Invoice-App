import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomerEntity } from '../models/customer.entity';
import { Customer } from '../models/customer.interface';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  createCustomer(createCustomerDto: CreateCustomerDto): Observable<Customer> {
    return from(this.customerRepository.save(createCustomerDto));
  }

  findAll(): Observable<Customer[]> {
    return from(this.customerRepository.find());
  }

  findOne(id: string): Observable<Customer> {
    return from(this.customerRepository.findOne({ id }));
  }

  deleteOne(id: string): Observable<any> {
    return from(this.customerRepository.delete({ id }));
  }

  updateOne(id: string, createCustomerDto: CreateCustomerDto): Observable<any> {
    return from(this.customerRepository.update(id, createCustomerDto));
  }
}
