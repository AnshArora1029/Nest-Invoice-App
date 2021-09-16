import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, switchMap, map, catchError, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/users.entity';
import { User } from '../models/users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  createUser(user: User): Observable<User> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((hashedPassword: string) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.password = hashedPassword;

        return from(this.userRepository.save(newUser)).pipe(
          map((user: User) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
          }),
          catchError((err) => throwError(err)),
        );
      }),
    );
  }

  findOne(id: string): Observable<any> {
    return from(this.userRepository.findOne({ id })).pipe(
      map((user: User) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }),
    );
  }

  findAll(): Observable<any[]> {
    return from(this.userRepository.find()).pipe(
      map((users) => {
        users.forEach(function (v) {
          delete v.password;
        });
        return users;
      }),
    );
  }

  deleteOne(id: string): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  updateOne(id: string, user: User): Observable<any> {
    delete user.email;
    delete user.password;
    return from(this.userRepository.update(id, user));
  }

  login(@Body() user: User): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.authService.generateJWT(user).pipe(map((jwt) => jwt));
        } else {
          return 'Incorrect username or password';
        }
      }),
    );
  }

  validateUser(email: string, password: string): Observable<User> {
    return this.findByMail(email).pipe(
      switchMap((user: User) =>
        this.authService.comparePassword(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { password, ...result } = user;
              return result;
            } else {
              throw Error;
            }
          }),
        ),
      ),
    );
  }

  findByMail(email: string) {
    return from(this.userRepository.findOne({ email }));
  }
}
