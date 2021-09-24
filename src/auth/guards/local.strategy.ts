// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-local';
// //import { User } from 'src/users/models/users.interface';
// import { UsersService } from 'src/users/service/users.service';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly usersService: UsersService) {
//     super({ usernameField: 'email' });
//   }

//   validate(email: string, password: string): any {
//     const user = this.usersService.validateUser(email, password);

//     if (!user) {
//       throw new UnauthorizedException();
//     }

//     return user;
//   }
// }
