import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { CustomRequest } from '../auth/custom-request.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order from cart' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })
  create(@Request() req: CustomRequest) {
    return this.service.create(req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user orders' })
  @ApiResponse({ status: 200, description: 'Return all orders.' })
  findAll(@Request() req: CustomRequest) {
    return this.service.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order' })
  @ApiResponse({ status: 200, description: 'Return the order.' })
  findOne(@Request() req: CustomRequest, @Param('id') id: string) {
    return this.service.findOne(req.user.id, id);
  }
}
