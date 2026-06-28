"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const payments_repository_1 = require("./payments.repository");
const stripe_provider_1 = require("./providers/stripe.provider");
const razorpay_provider_1 = require("./providers/razorpay.provider");
const database_service_1 = require("../database/database.service");
const client_1 = require("@prisma/client");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    configService;
    paymentsRepository;
    prisma;
    stripeProvider;
    razorpayProvider;
    logger = new common_1.Logger(PaymentsService_1.name);
    provider;
    providerName;
    constructor(configService, paymentsRepository, prisma, stripeProvider, razorpayProvider) {
        this.configService = configService;
        this.paymentsRepository = paymentsRepository;
        this.prisma = prisma;
        this.stripeProvider = stripeProvider;
        this.razorpayProvider = razorpayProvider;
        this.providerName =
            this.configService.get('PAYMENT_PROVIDER') || 'stripe';
        if (this.providerName === 'razorpay') {
            this.provider = this.razorpayProvider;
        }
        else {
            this.provider = this.stripeProvider;
        }
        this.logger.log(`Initialized PaymentsService with provider: ${this.providerName}`);
    }
    async createIntent(orderId, userId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.userId !== userId) {
            throw new common_1.BadRequestException('Order does not belong to user');
        }
        const currency = 'USD';
        const amount = Number(order.totalAmount);
        const intentData = await this.provider.createIntent(orderId, amount, currency);
        const existingPayment = await this.paymentsRepository.findByOrderId(orderId);
        if (!existingPayment) {
            await this.paymentsRepository.create({
                orderId,
                amount,
                currency,
                provider: this.providerName,
                status: client_1.PaymentStatus.PENDING,
            });
        }
        else {
            await this.paymentsRepository.updateStatus(orderId, client_1.PaymentStatus.PENDING);
        }
        return {
            provider: this.providerName,
            ...intentData,
        };
    }
    async verifyPayment(orderId, userId, providerData, clientProvider) {
        if (clientProvider !== this.providerName) {
            this.logger.warn(`Client provider ${clientProvider} differs from server provider ${this.providerName}. Trusting server config.`);
        }
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order || order.userId !== userId) {
            throw new common_1.NotFoundException('Order not found or access denied');
        }
        const isValid = await this.provider.verifyPayment(orderId, providerData);
        if (isValid) {
            const transactionId = String(providerData?.transactionId || `mock_tx_${Date.now()}`);
            await this.paymentsRepository.updateStatus(orderId, client_1.PaymentStatus.COMPLETED, transactionId);
            await this.prisma.order.update({
                where: { id: orderId },
                data: { status: client_1.OrderStatus.PROCESSING },
            });
            return { success: true, status: 'COMPLETED' };
        }
        else {
            await this.paymentsRepository.updateStatus(orderId, client_1.PaymentStatus.FAILED);
            return { success: false, status: 'FAILED' };
        }
    }
    async processWebhook(provider, payload, signature) {
        const activeProviderName = this.providerName;
        if (provider !== activeProviderName) {
            this.logger.warn(`Received webhook for ${provider}, but active provider is ${activeProviderName}`);
        }
        let webhookResult;
        try {
            webhookResult = await this.provider.processWebhook(payload, signature);
        }
        catch (error) {
            this.logger.error(`Webhook processing failed: ${String(error.message)}`);
            throw new common_1.BadRequestException('Webhook error');
        }
        const { orderId, status, transactionId } = webhookResult;
        if (status === 'COMPLETED') {
            await this.paymentsRepository.updateStatus(orderId, client_1.PaymentStatus.COMPLETED, transactionId);
            await this.prisma.order.update({
                where: { id: orderId },
                data: { status: client_1.OrderStatus.PROCESSING },
            });
        }
        else if (status === 'FAILED') {
            await this.paymentsRepository.updateStatus(orderId, client_1.PaymentStatus.FAILED, transactionId);
            await this.prisma.order.update({
                where: { id: orderId },
                data: { status: client_1.OrderStatus.PENDING },
            });
        }
        return { received: true };
    }
    async refundPayment(orderId, reason) {
        const payment = await this.paymentsRepository.findByOrderId(orderId);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status !== client_1.PaymentStatus.COMPLETED) {
            throw new common_1.BadRequestException('Payment is not in COMPLETED state');
        }
        if (!payment.transactionId) {
            throw new common_1.BadRequestException('Missing transaction ID for refund');
        }
        const refundResult = await this.provider.refund(payment.transactionId, Number(payment.amount), payment.currency, reason);
        await this.paymentsRepository.updateStatus(orderId, client_1.PaymentStatus.REFUNDED);
        return refundResult;
    }
    async getHistory(userId) {
        return this.paymentsRepository.findByUserId(userId);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        payments_repository_1.PaymentsRepository,
        database_service_1.DatabaseService,
        stripe_provider_1.StripeProvider,
        razorpay_provider_1.RazorpayProvider])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map