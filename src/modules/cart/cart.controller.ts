import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { CustomRequest } from '../auth/custom-request.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly service: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({ status: 200, description: 'Return the cart.' })
  getCart(@Request() req: CustomRequest) {
    return this.service.getCart(req.user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully added.',
  })
  addItem(@Request() req: CustomRequest, @Body() addDto: AddCartItemDto) {
    return this.service.addItem(req.user.id, addDto);
  }

  @Patch('items/:productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({
    status: 200,
    description: 'The item quantity has been successfully updated.',
  })
  updateItem(
    @Request() req: CustomRequest,
    @Param('productId') productId: string,
    @Body() updateDto: UpdateCartItemDto,
  ) {
    return this.service.updateItem(req.user.id, productId, updateDto);
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully removed.',
  })
  removeItem(
    @Request() req: CustomRequest,
    @Param('productId') productId: string,
  ) {
    return this.service.removeItem(req.user.id, productId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear the cart' })
  @ApiResponse({ status: 200, description: 'The cart has been cleared.' })
  clearCart(@Request() req: CustomRequest) {
    return this.service.clearCart(req.user.id);
  }
}
