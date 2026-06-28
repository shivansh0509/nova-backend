import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddWishlistDto } from './dto/add-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { CustomRequest } from '../auth/custom-request.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly service: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user wishlist' })
  @ApiResponse({ status: 200, description: 'Return the wishlist.' })
  getWishlist(@Request() req: CustomRequest) {
    return this.service.getWishlist(req.user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add a product to the wishlist' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully added.',
  })
  addProduct(@Request() req: CustomRequest, @Body() addDto: AddWishlistDto) {
    return this.service.addProduct(req.user.id, addDto);
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove a product from the wishlist' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully removed.',
  })
  removeProduct(
    @Request() req: CustomRequest,
    @Param('productId') productId: string,
  ) {
    return this.service.removeProduct(req.user.id, productId);
  }
}
