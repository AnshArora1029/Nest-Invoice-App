import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { catchError, from, map, Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User } from '../models/users.interface';
import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/create')
  // eslint-disable-next-line @typescript-eslint/ban-types
  createUser(@Body() user: User): Observable<User | Object> {
    return this.usersService.createUser(user).pipe(
      map((user: User) => user),
      catchError((err) => of({ error: err.message })),
    );
  }

  @Post('/login')
  // eslint-disable-next-line @typescript-eslint/ban-types
  login(@Body() user: User): Observable<Object> {
    return this.usersService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

  @Get('/:id')
  findOne(@Param('id') id: string): Observable<User> {
    return this.usersService.findOne(id);
  }

  @hasRoles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Delete('/delete/:id')
  deleteOne(@Param('id') id: string) {
    return this.usersService.deleteOne(id);
  }

  @Put('/:id')
  updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
    return from(this.usersService.updateOne(id, user));
  }
}
