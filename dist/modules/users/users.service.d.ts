import { DatabaseService } from '../database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    getProfile(userId: string): Promise<{
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
    updateProfile(userId: string, updateDto: UpdateUserDto): Promise<{
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
    getAddresses(userId: string): Promise<{
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
