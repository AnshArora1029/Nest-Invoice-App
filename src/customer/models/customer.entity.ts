import { InvoiceEntity } from 'src/invoice/models/invoice.entity';
import { UserEntity } from 'src/users/models/users.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: number;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  pincode: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => UserEntity, (user) => user.customers, { eager: false })
  createdBy: UserEntity;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((_type) => InvoiceEntity, (invoice) => invoice.customer, {
    eager: false,
  })
  invoices: InvoiceEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
