import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: DatabaseService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    });
    if (!user) throw new NotFoundException('User not found');
    const { password: _password, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, updateDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateDto,
    });
    const { password: _password, ...result } = user;
    return result;
  }

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
    });
  }
}
