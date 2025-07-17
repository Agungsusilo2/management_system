import {z, ZodType} from "zod";

export class UserValidation{
    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(3).max(100),
        password_hash: z.string().min(8).max(100),
        email: z.string().email().max(100),
        full_name: z.string().min(1).max(255),
        user_type: z.enum(['Admin', 'Dosen', 'Mahasiswa']),
    });

    static readonly LOGIN:ZodType = z.object({
        username: z.string().min(3).max(100),
        password_hash: z.string().min(8).max(100),
    })

    static readonly UPDATE:ZodType = z.object({
        username: z.string().min(3).max(100).optional(),
        password_hash: z.string().min(8).max(100).optional(),
        email: z.string().email().max(100).optional(),
        full_name: z.string().min(1).max(255).optional(),
        is_active: z.boolean().optional()
    })

}

