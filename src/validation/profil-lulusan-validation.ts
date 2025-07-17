
import { z, ZodType } from "zod";
import {
    CreateProfilLulusanRequest,
    SearchProfilLulusanRequest,
    UpdateProfilLulusanRequest
} from "../model/profile-lulusan-model";

export class ProfilLulusanValidation {
    static readonly CREATE: ZodType<CreateProfilLulusanRequest> = z.object({
        kodePL: z.string().max(50),
        deskripsi: z.string().min(1).max(255),
        kodeProfesi: z.string().max(50).optional(),
    });

    static readonly UPDATE: ZodType<UpdateProfilLulusanRequest> = z.object({
        deskripsi: z.string().min(1).max(255).optional(),
        kodeProfesi: z.string().max(50).optional(),
    });

    static readonly KODE_PL: ZodType<string> = z.string().max(50);

    static readonly SEARCH: ZodType<SearchProfilLulusanRequest> = z.object({
        deskripsi: z.string().max(255).optional(),
        kodeProfesi: z.string().max(50).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });
}