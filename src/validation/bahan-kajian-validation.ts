
import { z, ZodType } from "zod";
import { CreateBahanKajianRequest, UpdateBahanKajianRequest, SearchBahanKajianRequest } from "../model/bahan-kajian-model";

export class BahanKajianValidation {
    static readonly CREATE: ZodType<CreateBahanKajianRequest> = z.object({
        kodeBK: z.string().max(50),
        namaBahanKajian: z.string().min(1).max(255),
        kodeReferensi: z.string().max(50),
    });

    static readonly UPDATE: ZodType<UpdateBahanKajianRequest> = z.object({
        namaBahanKajian: z.string().min(1).max(255).optional(),
        kodeReferensi: z.string().max(50).optional(),
    });

    static readonly KODE_BK: ZodType<string> = z.string().max(50);

    static readonly SEARCH: ZodType<SearchBahanKajianRequest> = z.object({
        namaBahanKajian: z.string().max(255).optional(),
        kodeReferensi: z.string().max(50).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });
}