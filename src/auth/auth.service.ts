import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
  }

  async signUp(dto: AuthDto) {
    // generate the password hash
    const hash = await argon2.hash(dto.password);
    // save the new user in the db
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash
        }
        // select: {
        //   id: true,
        //   email: true,
        //   createdAt: true
        // }
      });

      // return the saved user
      return this.signToken(user.id, user.email);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('email 重复添加');
        }
      }
      throw err;
    }
  }

  async signIn(dto: AuthDto) {
    // find the user by email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email
      }
    });
    // if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException('该用户不存在');
    }
    // compare password
    const pwMatches = await argon2.verify(user.hash, dto.password);
    // if password incorrect throw exception
    if (!pwMatches) {
      throw new ForbiddenException('密码不对');
    }
    // send back the user
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('SECRET');

    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '15m',
    });

    return {
      access_token: token,
    };
  }
}