import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import type { CustomRequest } from '../auth/custom-request.interface';
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
    getProfile(req: CustomRequest): Promise<{
        addresses: {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
            isDefault: boolean;
        }[];
        email: string;
        firstName: string | null;
        lastName: string | null;
        id: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    updateProfile(req: CustomRequest, updateDto: UpdateUserDto): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        id: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    getAddresses(req: CustomRequest): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        isDefault: boolean;
    }[]>;
}
