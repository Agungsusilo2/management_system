
import { z, ZodType } from "zod";
import { CreateReferensiRequest, UpdateReferensiRequest, SearchReferensiRequest } from "../model/referensi-model";

export class ReferensiValidation {
    static readonly CREATE: ZodType<CreateReferensiRequest> = z.object({
        kodeReferensi: z.string().max(50),
        namaReferensi: z.string().min(1).max(255),
    });

    static readonly UPDATE: ZodType<UpdateReferensiRequest> = z.object({
        namaReferensi: z.string().min(1).max(255).optional(),
    });

    static readonly KODE_REFERENSI: ZodType<string> = z.string().max(50);

    static readonly SEARCH: ZodType<SearchReferensiRequest> = z.object({
        namaReferensi: z.string().max(255).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });
}