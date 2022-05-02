import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { GetUserDecorate } from '../auth/decorate';
import { JwtGuard } from '../auth/guard';
import { CreateBookmark } from './dto';
import { UpdateBookmark } from './dto/update-bookmark';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  getBookMarks(@GetUserDecorate('id') userId: number) {
    return this.bookmarkService.getBookMarks(userId);
  }

  @Get(':id')
  getBookMarkById(
    @GetUserDecorate('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookMarkById(userId, bookmarkId);
  }

  @Post()
  createBookMark(
    @GetUserDecorate('id') userId: number,
    @Body() dto: CreateBookmark,
  ) {
    return this.bookmarkService.createBookMark(userId, dto);
  }

  @Patch(':id')
  updateBookMarkById(
    @GetUserDecorate('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: UpdateBookmark,
  ) {
    return this.bookmarkService.updateBookMarkById(userId, bookmarkId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookMarkById(
    @GetUserDecorate('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookMarkById(userId, bookmarkId);
  }
}
