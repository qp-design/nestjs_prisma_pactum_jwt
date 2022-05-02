import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserEditorDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async editor(user: User, payload: UserEditorDto) {
    if(user.email === payload.email)
      throw new ForbiddenException('email 不能重复添加');

    const userId = user.id;
    const userInfo = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...payload,
      },
    });

    if(!userInfo)
      throw new ForbiddenException('没有权限');

    delete userInfo.hash;

    return userInfo;
  }
}
