import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  createCustomer(
    createCustomerDto: CreateCustomerDto,
    user,
  ): Promise<CustomerEntity> {
    return this.customerRepository.save({
      ...createCustomerDto,
      user: user.id,
    });
  }

  findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  findOne(id: string): Promise<Customer> {
    return this.customerRepository.findOne({ id });
  }

  deleteOne(id: string): Promise<any> {
    return this.customerRepository.delete({ id });
  }

  updateOne(id: string, createCustomerDto: CreateCustomerDto): Promise<any> {
    return this.customerRepository.update(id, createCustomerDto);
  }
}
