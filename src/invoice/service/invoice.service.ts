import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/models/users.interface';
import { UsersService } from 'src/users/service/users.service';
import { Repository } from 'typeorm';
import { InvoiceDto } from '../dto/invoice.dto';
import { InvoiceEntity } from '../models/invoice.entity';
import * as htmlToPdf from 'html-pdf';
import * as fs from 'fs';
import { SendGridService } from '@anchan828/nest-sendgrid';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private invoiceRepository: Repository<InvoiceEntity>,
    public userService: UsersService,
    public sendgridService: SendGridService,
  ) {}

  async createInvoice(invoiceDto: InvoiceDto, creator: User): Promise<any> {
    const subTotal = invoiceDto.items.reduce((acc, item) => {
      return acc + Number(item.price * item.quantity);
    }, 0);

    const cgstAmount = subTotal * Number((invoiceDto.cgst / 100).toFixed(2));
    const sgstAmount = subTotal * Number((invoiceDto.sgst / 100).toFixed(2));
    const taxAmount = cgstAmount + sgstAmount;
    const payable = subTotal + taxAmount;
    const balance = invoiceDto.cashTendered - payable;
    const invoice = await this.invoiceRepository.save({
      ...invoiceDto,
      subTotal,
      cgstAmount,
      sgstAmount,
      taxAmount,
      payable,
      balance,
      createdBy: creator,
    } as any);
    await this.generatePdf(invoice.id);
    // const pdf = await this.pdfService.generatePDF(invoice);
    await this.sendMail();
    return invoice;
  }

  async generatePdf(id) {
    const invoice = await this.findOne(id);
    let i = 0;
    const str1 = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Example 1</title>
        <link rel="stylesheet" href="style.css" media="all" />
      </head>
      <body>
        <header class="clearfix">
          <div id="logo">
            <img src="logo.png">
          </div>
          <h1 align="center">INVOICE</h1>
          <div id="company" class="clearfix">
            <div>Company Name</div>
            <div>Company Contact no.</div>
            <div><a href="mailto:company@example.com">company@example.com</a></div>
          </div>
          <div id="project">
            <div><span>Client</div>
            <div>Client Name</div>
            <div><span>Client Address</span> 796 Silver Harbour, TX 79273, US</div>
            <div><span>Client Email</span> <a href="mailto:john@example.com">john@example.com</a></div>
            <div><span>Date & Time</span> ${Date()
              .toString()
              .split('GM', 1)}</div>
          </div>
        </header>
        <main>
          <table>
            <thead>
              <tr align="left">
                <th width="250px" class="service">Item</th>
                <th width="250px">Price</th>
                <th width="250px">Qty</th>
                <th width="250px">Total</th>
              </tr>
              <tbody>`;
    const arr = [];
    for (i = 0; i < invoice.items.length; i++) {
      arr.push(`<tr>
      <td width="250px" class="desc">${invoice.items[i].description}</td>
      <td width="250px" class="unit">${invoice.items[i].price}</td>
      <td width="250px" class="qty">${invoice.items[i].quantity}</td>
      <td width="250px" class="total">${
        invoice.items[i].price * invoice.items[i].quantity
      }</td>
    </tr>`);
    }
    const str2: string = arr.join('');
    const str3 = `<tr>
    <td colspan="3">Subtotal</td>
    <td class="total">${invoice.subTotal}</td>
  </tr>
  <tr>
    <td colspan="3">Tax Amount</td>
    <td class="total">${invoice.taxAmount}</td>
  </tr>
  <tr>
    <td colspan="3" class="grand total">GRAND TOTAL</td>
    <td class="grand total">${invoice.payable}</td>
  </tr>
</tbody>
</table>
<div id="notices">
<div>NOTICE:</div>
<div class="notice">A finance charge of 1.5% will be made on unpaid balances after 30 days.</div>
</div>
</main>
<footer>
Invoice was created on a computer and is valid without the signature and seal.
</footer>
</body>
</html>`;
    // eslint-disable-next-line prefer-const
    let hbs = str1.concat(str2, str3);
    const pdf = htmlToPdf
      .create(hbs)
      .toFile('./invoice.pdf', function (err, res) {
        if (err) return console.log(err);
        console.log(res);
      });
    return pdf;
  }

  async sendMail() {
    const pathToAttachment =
      '/Users/theboywholived/Desktop/Apps/invoice-app/invoice.pdf';
    const attachment = fs.readFileSync(pathToAttachment, 'base64');
    await this.sendgridService
      .send({
        to: 'inhell697@gmail.com',
        from: 'aroraansh1029@gmail.com',
        subject: 'Invoice',
        text: 'Here is your invoice',
        attachments: [
          {
            content: attachment,
            filename: 'invoice.pdf',
            type: 'application/pdf',
            disposition: 'attachment',
          },
        ],
      })
      .then(() => {
        console.log('Email Sent');
      })
      .catch((error) => {
        console.log(error.response.body);
      });
    // fs.unlink(
    //   '/Users/theboywholived/Desktop/Apps/invoice-app/invoice.pdf',
    //   (err) => {
    //     if (err) {
    //       console.log('There is Error in deleting');
    //     } else {
    //       console.log('Successfully deleted the file');
    //     }
    //   },
    // );
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
