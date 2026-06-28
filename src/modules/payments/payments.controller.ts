/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  CreatePaymentIntentDto,
  VerifyPaymentDto,
  RefundPaymentDto,
} from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intent')
  async createIntent(
    @Request() req: { user: { id: string } },
    @Body() dto: CreatePaymentIntentDto,
  ) {
    return this.paymentsService.createIntent(dto.orderId, req.user.id);
  }

  @Post('verify')
  async verifyPayment(
    @Request() req: { user: { id: string } },
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.paymentsService.verifyPayment(
      dto.orderId,
      req.user.id,
      dto.providerData || {},
      dto.provider,
    );
  }

  @Post(':id/refund')
  async refundPayment(@Param('id') id: string, @Body() dto: RefundPaymentDto) {
    return this.paymentsService.refundPayment(id, dto.reason);
  }

  @Get('history')
  async getHistory(@Request() req: { user: { id: string } }) {
    return this.paymentsService.getHistory(req.user.id);
  }
}
