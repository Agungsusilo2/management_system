
import { Admin } from '../../generated/prisma';

export type AdminResponse = {
    id: string;
    userId: string;
    nipAdmin?: string | null;
    jabatan?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
};

export type CreateAdminRequest = {


    nipAdmin?: string;
    jabatan?: string;
    phoneNumber?: string;
    address?: string;
};

export type UpdateAdminRequest = {
    nipAdmin?: string;
    jabatan?: string;
    phoneNumber?: string;
    address?: string;
};

export type SearchAdminRequest = {
    nipAdmin?: string;
    jabatan?: string;
    page?: number;
    size?: number;
}


export function toAdminResponse(admin: Admin): AdminResponse {
    return {
        id: admin.id,
        userId: admin.userId,
        nipAdmin: admin.nipAdmin,
        jabatan: admin.jabatan,
        phoneNumber: admin.phoneNumber,
        address: admin.address,
    };
}