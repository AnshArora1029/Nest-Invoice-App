import { IsEmail } from 'class-validator';
import { CustomerEntity } from 'src/customer/models/customer.entity';
import { InvoiceEntity } from 'src/invoice/models/invoice.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { UserRole } from './users.interface';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ default: false })
  flag: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CASHIER })
  role: UserRole;

  @Column()
  password: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((_type) => CustomerEntity, (customer) => customer.createdBy, {
    eager: false,
  })
  customers: CustomerEntity[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((_type) => InvoiceEntity, (invoice) => invoice.createdBy, {
    eager: false,
  })
  invoices: InvoiceEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  emailAndRoleToLowerCase() {
    this.email.toLowerCase();
    this.role.toLowerCase();
  }
}
