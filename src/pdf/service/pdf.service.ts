import { Injectable } from '@nestjs/common';
// import * as htmlToPdf from 'html-to-pdf';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const htmlToPdf = require('html-to-pdf');
import * as htmlToPdf from 'html-pdf';
import * as fs from 'fs';
import { SendGridService } from '@anchan828/nest-sendgrid';

@Injectable()
export class PdfService {
  constructor(private sendGridService: SendGridService) {}

  async generatePdf() {
    // eslint-disable-next-line prefer-const
    let html = fs.readFileSync(
      '/Users/theboywholived/Desktop/Apps/invoice-app/src/pdf/views/pdf.html',
      'utf8',
    );
    const pdf = htmlToPdf
      .create(html)
      .toFile('./invoice.pdf', function (err, res) {
        if (err) return console.log(err);
        console.log(res);
      });
    await this.sendMail();
    return pdf;
  }

  async sendMail() {
    const pathToAttachment =
      '/Users/theboywholived/Desktop/Apps/invoice-app/invoice.pdf';
    const attachment = fs.readFileSync(pathToAttachment, 'base64');
    console.log('*******************THIS IS MAILER******************');
    await this.sendGridService
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
    fs.unlink(
      '/Users/theboywholived/Desktop/Apps/invoice-app/invoice.pdf',
      (err) => {
        if (err) {
          console.log('There is Error in deleting');
        } else {
          console.log('Successfully deleted the file');
        }
      },
    );
  }
}

// async generatePdf() {
//   console.log('This is pdf service');
//   return htmlToPdf.convertHTMLFile(
//     './views/pdf.html',
//     './',
//     (error: any, success: any) => {
//       if (error) {
//         console.log('***Error creating pdf***', error);
//       } else {
//         console.log('***Success***', success);
//       }
//     },
//   );
// }

// async generatePdf(): Promise<any> {
//   const html = fs.readFileSync('./../views/pdf.html', 'utf-8');
//   return htmlToPdf.create(html).toBuffer(function (err, buffer) {
//     console.log('***This is Buffer***');
//     console.log(buffer);
//     return buffer;
//   });
// }
