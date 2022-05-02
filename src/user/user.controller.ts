import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard';
import { GetUserDecorate } from '../auth/decorate';
import { User } from '@prisma/client';
import { UserEditorDto } from './dto';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  signUp(@GetUserDecorate() user: User) {
    return user;
  }

  @Patch('editor')
  editor(@GetUserDecorate() user: User, @Body() dto: UserEditorDto) {
    return this.userService.editor(user, dto);
  }
}
