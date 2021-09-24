import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/models/users.interface';
import { UsersService } from 'src/users/service/users.service';
import { Repository } from 'typeorm';
import { InvoiceDto } from '../dto/invoice.dto';
import { InvoiceEntity } from '../models/invoice.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private invoiceRepository: Repository<InvoiceEntity>,
    private usersService: UsersService,
  ) {}

  async createInvoice(
    invoiceDto: InvoiceDto,
    creator: User,
  ): Promise<InvoiceEntity> {
    const subTotal = invoiceDto.items.reduce((acc, item) => {
      return acc + Number(item.price * item.quantity);
    }, 0);

    const cgstAmount = subTotal * Number((invoiceDto.cgst / 100).toFixed(2));
    const sgstAmount = subTotal * Number((invoiceDto.sgst / 100).toFixed(2));
    const taxAmount = cgstAmount + sgstAmount;
    const payable = subTotal + taxAmount;
    const balance = invoiceDto.cashTendered - payable;
    return await this.invoiceRepository.save({
      ...invoiceDto,
      subTotal,
      cgstAmount,
      sgstAmount,
      taxAmount,
      payable,
      balance,
      createdBy: creator,
    } as any);
  }

  async findByCustomerId(id: string): Promise<InvoiceEntity[]> {
    return await this.invoiceRepository
      .createQueryBuilder('invoice')
      .where('invoice.customer = :id', { id })
      .getMany();
  }

  async findByUserId(user: User): Promise<any> {
    const id = user.id;
    return await this.invoiceRepository
      .createQueryBuilder('invoice')
      .where('invoice.createdBy = :id', { id })
      .getMany();
  }

  async findAll(): Promise<InvoiceEntity[]> {
    return await this.invoiceRepository.find();
  }

  async findOne(id: string): Promise<InvoiceEntity> {
    return await this.invoiceRepository.findOne(id);
  }

  async deleteOne(id: string): Promise<void> {
    const deleted = await this.invoiceRepository.delete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException(`No invoice with ${id} exists`);
    }
  }
}
