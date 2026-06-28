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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCart(userId) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                cartItems: {
                    include: { product: true },
                },
            },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: { cartItems: { include: { product: true } } },
            });
        }
        return cart;
    }
    async getCart(userId) {
        return this.getOrCreateCart(userId);
    }
    async addItem(userId, addDto) {
        const cart = await this.getOrCreateCart(userId);
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: { cartId: cart.id, productId: addDto.productId },
            },
        });
        if (existingItem) {
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + addDto.quantity },
            });
        }
        else {
            await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: addDto.productId,
                    quantity: addDto.quantity,
                },
            });
        }
        return this.getOrCreateCart(userId);
    }
    async updateItem(userId, productId, updateDto) {
        const cart = await this.getOrCreateCart(userId);
        await this.prisma.cartItem.update({
            where: { cartId_productId: { cartId: cart.id, productId } },
            data: { quantity: updateDto.quantity },
        });
        return this.getOrCreateCart(userId);
    }
    async removeItem(userId, productId) {
        const cart = await this.getOrCreateCart(userId);
        await this.prisma.cartItem.delete({
            where: { cartId_productId: { cartId: cart.id, productId } },
        });
        return this.getOrCreateCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        return this.getOrCreateCart(userId);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], CartService);
//# sourceMappingURL=cart.service.js.map