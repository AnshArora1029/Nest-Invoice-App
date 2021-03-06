import { CustomerEntity } from 'src/customer/models/customer.entity';
import { UserEntity } from 'src/users/models/users.entity';
import { User } from 'src/users/models/users.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Item {
  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  quantity: number;
}

@Entity()
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  invoice_id: string;

  @Column()
  description: string;

  @Column({
    type: 'jsonb',
    default: [],
  })
  items: Item[];

  @Column()
  cgst: number;

  @Column()
  sgst: number;

  @Column()
  taxAmount: number;

  @Column()
  subTotal: number;

  @Column()
  payable: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => CustomerEntity, (customer) => customer.invoices, {
    eager: false,
  })
  customer: CustomerEntity;

  @Column({ default: 0 })
  cashTendered: number;

  @Column()
  balance: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => UserEntity, (user) => user.invoices, {
    eager: false,
  })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
