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
import { AuthCredentialsDto } from 'src/auth/authCredentialsDto/auth-CredentialsDto.dto';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserRole } from '../models/users.interface';
import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/create')
  createAllUser(
    @Body() createUserDto: CreateUserDto,
    @Req() request,
  ): Promise<any> | string {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    const loggedUser = request.user;
    return this.usersService.createUser(createUserDto, loggedUser);
  }

  @Post('/login')
  login(@Body() authCredentialsDto: AuthCredentialsDto): Promise<any> {
    return this.usersService.login(authCredentialsDto);
  }

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:id')
  findOne(@Param('id') id: string, @Req() request): Promise<User> | string {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    return this.usersService.findOne(id);
  }

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Req() request) {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    return this.usersService.findAll();
  }

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete('/delete/:id')
  deleteOne(@Param('id') id: string, @Req() request) {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    const loggedUser = request.user;
    return this.usersService.deleteOne(id, loggedUser);
  }

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/:id')
  updateOne(
    @Param('id') id: string,
    @Body() user: User,
    @Req() request,
  ): Promise<any> | string {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    const loggedUser = request.user;
    return this.usersService.updateOne(id, user, loggedUser);
  }

  @hasRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/:id/updatePassword')
  updatePassword(
    @Param('id') id: string,
    @Body() password,
    @Req() request,
  ): Promise<any> {
    const loggedUser = request.user;
    const newPassword = password.password;
    return this.usersService.updatePassword(id, newPassword, loggedUser);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/role/:id')
  updateRole(
    @Param('id') id: string,
    @Body() role,
    @Req() request,
  ): Promise<any> | string {
    if (request.user.flag === false) {
      return 'Change password first';
    }
    const newRole = role.role;
    const loggedUser = request.user;
    return this.usersService.updateRole(id, newRole, loggedUser);
  }
}
