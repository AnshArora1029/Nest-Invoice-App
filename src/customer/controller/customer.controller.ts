import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/models/users.interface';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { Customer } from '../models/customer.interface';
import { CustomerService } from '../service/customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/create')
  createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
    @Req() request,
  ): Promise<Customer> | string {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    const user = request.user;
    return this.customerService.createCustomer(createCustomerDto, user);
  }

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAllCustomers(@Req() request) {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    return this.customerService.findAll();
  }

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:id')
  findOne(@Param('id') id: string, @Req() request): Promise<Customer> | string {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    return this.customerService.findOne(id);
  }

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/delete/:id')
  deleteOne(@Param('id') id: string, @Req() request): Promise<any> | string {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    return this.customerService.deleteOne(id);
  }

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/:id')
  updateOne(
    @Param('id') id: string,
    @Body() createCustomerDto: CreateCustomerDto,
    @Req() request,
  ): Promise<any> | string {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    return this.customerService.updateOne(id, createCustomerDto);
  }
}
