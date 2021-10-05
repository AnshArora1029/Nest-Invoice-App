// import { Controller } from '@nestjs/common';
// import { PdfService } from '../service/pdf.service';

// @Controller('pdf')
// export class PdfController {
//   constructor(private pdfService: PdfService) {}
// }

import { Controller, Get, Res } from '@nestjs/common';
import { PdfService } from './../service/pdf.service';
import { Response } from 'express';

@Controller('pdf')
export class PdfController {
  constructor(private pdfService: PdfService) {}

  @Get()
  async getPDF(@Res() res: Response) {
    const buffer = await this.pdfService.generatePdf();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=example.pdf',
      // 'Content-Length': buffer.Length,
    });
    res.end(buffer);
  }

  @Get('/mail')
  async sendMail() {
    return this.pdfService.sendMail();
  }
}
