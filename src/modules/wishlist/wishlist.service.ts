import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AddWishlistDto } from './dto/add-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: DatabaseService) {}

  private async getOrCreateWishlist(userId: string) {
    let wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
      include: { products: true },
    });

    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({
        data: { userId },
        include: { products: true },
      });
    }
    return wishlist;
  }

  async getWishlist(userId: string) {
    return this.getOrCreateWishlist(userId);
  }

  async addProduct(userId: string, addDto: AddWishlistDto) {
    const wishlist = await this.getOrCreateWishlist(userId);

    await this.prisma.wishlist.update({
      where: { id: wishlist.id },
      data: {
        products: {
          connect: { id: addDto.productId },
        },
      },
    });

    return this.getOrCreateWishlist(userId);
  }

  async removeProduct(userId: string, productId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);

    await this.prisma.wishlist.update({
      where: { id: wishlist.id },
      data: {
        products: {
          disconnect: { id: productId },
        },
      },
    });

    return this.getOrCreateWishlist(userId);
  }
}
