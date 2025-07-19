import {
    CreateLingkupKelasRequest,
    SearchLingkupKelasRequest,
    UpdateLingkupKelasRequest
} from "../model/lingkup-kelas-model";
import {z, ZodType} from "zod";

export class LingkupKelasValidation {
    static readonly CREATE: ZodType<CreateLingkupKelasRequest> = z.object({
        namaLingkupKelas: z.string().min(1).max(50),
    });

    static readonly UPDATE: ZodType<UpdateLingkupKelasRequest> = z.object({
        namaLingkupKelas: z.string().min(1).max(50).optional(),
    });

    static readonly SEARCH: ZodType<SearchLingkupKelasRequest> = z.object({
        namaLingkupKelas: z.string().max(50).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });

    static readonly ID_LINGKUP_KELAS: ZodType<string> = z.string().uuid();
}
