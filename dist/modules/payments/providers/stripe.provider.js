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
var StripeProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let StripeProvider = StripeProvider_1 = class StripeProvider {
    configService;
    logger = new common_1.Logger(StripeProvider_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async createIntent(orderId, amount, currency) {
        this.logger.log(`Creating Stripe PaymentIntent for order ${orderId}, amount: ${amount}`);
        return {
            clientSecret: `pi_mock_${orderId}_secret_${Date.now()}`,
            id: `pi_mock_${orderId}`,
            amount: Math.round(amount * 100),
            currency,
        };
    }
    async verifyPayment(orderId, data) {
        this.logger.log(`Verifying Stripe payment for order ${orderId}`);
        if (data && data.mockFailure) {
            return false;
        }
        return true;
    }
    async processWebhook(payload, signature) {
        this.logger.log(`Processing Stripe webhook`);
        if (!signature) {
            throw new common_1.BadRequestException('Missing signature');
        }
        const eventType = String(payload.type || 'payment_intent.succeeded');
        const orderId = String(payload.data?.object?.metadata?.orderId || 'mock_order_id');
        const transactionId = String(payload.data?.object?.id || `txn_${Date.now()}`);
        if (eventType === 'payment_intent.succeeded') {
            return { orderId, status: 'COMPLETED', transactionId };
        }
        else if (eventType === 'payment_intent.payment_failed') {
            return { orderId, status: 'FAILED', transactionId };
        }
        return { orderId, status: 'PENDING' };
    }
    async refund(transactionId, amount, currency, reason) {
        this.logger.log(`Refunding Stripe payment ${transactionId}`);
        return {
            id: `re_mock_${Date.now()}`,
            object: 'refund',
            amount: Math.round(amount * 100),
            currency,
            reason,
            status: 'succeeded',
        };
    }
};
exports.StripeProvider = StripeProvider;
exports.StripeProvider = StripeProvider = StripeProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeProvider);
//# sourceMappingURL=stripe.provider.js.map