import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/service/auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/users.entity';
import { User, UserRole } from '../models/users.interface';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/auth/guards/jwt-payload.interface';
import {
  ConflictException,
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialsDto } from 'src/auth/authCredentialsDto/auth-CredentialsDto.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async onModuleInit() {
    const users = await this.userRepository.find();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('password', salt);
    if (users.length === 0) {
      console.log('Creating Admin');
      const newUser = await this.userRepository.create({
        name: 'Admin',
        username: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      try {
        await this.userRepository.save(newUser);
        console.log('Admin Created and saved in Database');
      } catch (error) {
        console.log('Some Error Occured');
      }
    } else {
      console.log('Admin Already Exists');
    }
  }

  async createUser(
    createUserDto: CreateUserDto,
    loggedUser,
  ): Promise<User | string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;
    if (
      loggedUser.role === UserRole.ADMIN &&
      createUserDto.role.toLowerCase() === UserRole.ADMIN
    ) {
      return 'You are not authorized to create an Admin';
    } else if (
      loggedUser.role === UserRole.MANAGER &&
      createUserDto.role.toLowerCase() === UserRole.ADMIN
    ) {
      return 'You are not authorized to create an Admin';
    } else if (
      loggedUser.role === UserRole.MANAGER &&
      createUserDto.role.toLowerCase() === UserRole.MANAGER
    ) {
      return 'You are not authorised to create Managers';
    } else if (loggedUser.role === UserRole.CASHIER) {
      return 'You are not authorized to create';
    }
    try {
      await this.userRepository.save(createUserDto);
    } catch (error) {
      console.log(error.code);
      if (error.code === '23505') {
        throw new ConflictException('Email or Username already taken');
      } else {
        throw new InternalServerErrorException();
      }
    }
    delete createUserDto.password;
    return createUserDto;
  }

  async updatePassword(
    id: string,
    newPassword: string,
    loggedUser,
  ): Promise<any> {
    const temp = await this.userRepository.findOne(id);

    if (
      loggedUser.role === UserRole.ADMIN &&
      temp.role === UserRole.ADMIN &&
      loggedUser.id !== temp.id
    ) {
      return 'You are not authorised to change password for other admins';
    } else if (
      loggedUser.role === UserRole.MANAGER &&
      temp.role === UserRole.ADMIN
    ) {
      return 'You are not allowed to change password for the admin';
    } else if (
      loggedUser.role === UserRole.MANAGER &&
      temp.role === UserRole.MANAGER &&
      loggedUser.id !== temp.id
    ) {
      return 'You are not authorised to change password for other managers';
    } else if (
      loggedUser.role === UserRole.CASHIER &&
      loggedUser.id !== temp.id
    ) {
      return 'You are not authorised to change passwords except you own';
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    temp.password = hashedPassword;
    temp.flag = true;
    return this.userRepository.update(id, temp);
  }

  async updateRole(id: string, role: UserRole, loggedUser): Promise<any> {
    if (loggedUser.role !== UserRole.ADMIN) {
      return 'You need to be an admin to assign and update roles';
    } else if (role === UserRole.ADMIN) {
      return 'You are not authorised to promote users to be Admin';
    }
    const temp = await this.findOne(id);
    temp.role = role;
    return this.userRepository.update(id, temp);
  }

  async findOne(id: string): Promise<User> {
    const result = await this.userRepository.findOne({ id });
    return result;
  }

  async findAll() {
    const array = this.userRepository.find();
    (await array).map(function (item) {
      delete item.password;
      delete item.flag;
      return item;
    });
    return array;
  }

  async deleteOne(id: string, loggedUser): Promise<any | string> {
    const toBeDeleted = await this.findOne(id);
    if (
      loggedUser.role === UserRole.ADMIN &&
      toBeDeleted.role === UserRole.ADMIN
    ) {
      return 'You are not authorised to delete admin';
    } else if (
      loggedUser.role === UserRole.MANAGER &&
      toBeDeleted.role === UserRole.ADMIN
    ) {
      return 'You are not authorised to delete admin';
    } else if (
      loggedUser.role === UserRole.MANAGER &&
      toBeDeleted.role === UserRole.MANAGER
    ) {
      return 'You are not authorised to delete managers';
    }
    return this.userRepository.delete(id);
  }

  async updateOne(id: string, user: User, loggedUser): Promise<any | string> {
    const toBeUpdated = await this.userRepository.findOne(id);
    if (
      loggedUser.role === UserRole.MANAGER &&
      toBeUpdated.role === UserRole.ADMIN
    ) {
      return 'You are not authorised to update admin details';
    } else if (
      loggedUser.role === UserRole.MANAGER &&
      toBeUpdated.role === UserRole.MANAGER &&
      loggedUser.id !== toBeUpdated.id
    ) {
      return 'You are not authorised to update manager details except your own';
    } else if (
      loggedUser.role === UserRole.CASHIER &&
      loggedUser.id !== toBeUpdated.id
    ) {
      return 'You are not authorised to update any details except your own';
    }
    delete user.role;
    delete user.email;
    delete user.password;
    return this.userRepository.update(id, user);
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = this.authService.jwtService.sign(payload);
      delete user.password;
      return { accessToken, user };
    } else {
      throw new UnauthorizedException('Incorrect Email or Password');
    }
  }

  findByMail(email: string): Promise<any> {
    return this.userRepository.findOne({ email });
  }
}
