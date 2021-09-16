import { IsNotEmpty } from 'class-validator';
import { Item } from '../models/invoice.entity';

export class InvoiceDto {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  items: Item[];

  @IsNotEmpty()
  cgst: number;

  @IsNotEmpty()
  sgst: number;

  @IsNotEmpty()
  cashTendered: number;

  @IsNotEmpty()
  customer: string;
}
