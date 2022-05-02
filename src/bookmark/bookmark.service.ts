import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmark } from './dto';
import { UpdateBookmark } from './dto/update-bookmark';

@Injectable()
export class BookmarkService {
  constructor(private readonly prismaService: PrismaService) {}
  async getBookMarks(userId: number) {
    return await this.prismaService.bookmark.findMany({
      where: {
        userId,
      },
    });
  }
  async getBookMarkById(userId: number, bookmarkId: number) {
    return await this.prismaService.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async createBookMark(userId: number, dto: CreateBookmark) {
    return await this.prismaService.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async updateBookMarkById(
    userId: number,
    bookmarkId: number,
    dto: UpdateBookmark,
  ) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('没有权限');

    return await this.prismaService.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookMarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('没有权限');

    await this.prismaService.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
