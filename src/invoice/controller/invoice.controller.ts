import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User, UserRole } from 'src/users/models/users.interface';
import { InvoiceDto } from '../dto/invoice.dto';
import { InvoiceEntity } from '../models/invoice.entity';
import { InvoiceService } from '../service/invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/user')
  findByUserId(@Req() request): Promise<InvoiceEntity[]> | string {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    const user: User = request.user;
    return this.invoiceService.findByUserId(user);
  }

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/create')
  createInvoice(
    @Body() invoiceDto: InvoiceDto,
    @Req() request,
  ): Promise<InvoiceEntity> {
    const creator: User = request.user;
    return this.invoiceService.createInvoice(invoiceDto, creator);
  }

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:id')
  findOne(
    @Param('id') id: string,
    @Req() request,
  ): Promise<InvoiceEntity> | string {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    return this.invoiceService.findOne(id);
  }

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Req() request): Promise<InvoiceEntity[]> | string {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    return this.invoiceService.findAll();
  }

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/customer/:id')
  findByCustomerId(
    @Param('id') id: string,
    @Req() request,
  ): Promise<InvoiceEntity[]> | string {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    return this.invoiceService.findByCustomerId(id);
  }

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/:id')
  deleteOne(@Param('id') id: string, @Req() request): Promise<void> | string {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    return this.invoiceService.deleteOne(id);
  }
}
