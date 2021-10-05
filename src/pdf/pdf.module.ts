// import { Module } from '@nestjs/common';
// import { PDFModule } from '@t00nday/nestjs-pdf';
// @Module({
//   imports: [
//     // ... other modules
//     PDFModule.register({
//       view: {
//         root: '/path/to/template',
//         engine: 'handlebars',
//       },
//     }),
//   ],
// })
// export class PdfModule {}
import { Module } from '@nestjs/common';
import { PdfService } from './pdf/../service/pdf.service';
import { PdfController } from './pdf/../controller/pdf.controller';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ConfigService,
    SendGridModule.forRoot({
      apikey:
        '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',
    }),
  ],
  providers: [PdfService],
  controllers: [PdfController],
})
export class PdfModule {}
