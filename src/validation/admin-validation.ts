
import { z, ZodType } from "zod";
import { CreateAdminRequest, UpdateAdminRequest, SearchAdminRequest } from "../model/admin-model";

export class AdminValidation {
    static readonly CREATE: ZodType<CreateAdminRequest> = z.object({
        nipAdmin: z.string().max(50).optional(),
        jabatan: z.string().max(100).optional(),
        phoneNumber: z.string().max(20).optional(),
        address: z.string().max(500).optional(),
    });

    static readonly UPDATE: ZodType<UpdateAdminRequest> = z.object({
        nipAdmin: z.string().max(50).optional(),
        jabatan: z.string().max(100).optional(),
        phoneNumber: z.string().max(20).optional(),
        address: z.string().max(500).optional(),
    });

    static readonly SEARCH: ZodType<SearchAdminRequest> = z.object({
        nipAdmin: z.string().max(50).optional(),
        jabatan: z.string().max(100).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });

    static readonly ADMIN_ID: ZodType<string> = z.string().min(1).max(100);
}