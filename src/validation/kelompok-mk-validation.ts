import {CreateKelompokMKRequest, SearchKelompokMKRequest, UpdateKelompokMKRequest} from "../model/kelompok-mk-model";
import {z, ZodType} from "zod";

export class KelompokMKValidation {
    static readonly CREATE: ZodType<CreateKelompokMKRequest> = z.object({
        namaKelompokMk: z.string().min(1).max(50),
    });

    static readonly UPDATE: ZodType<UpdateKelompokMKRequest> = z.object({
        namaKelompokMk: z.string().min(1).max(50).optional(),
    });

    static readonly SEARCH: ZodType<SearchKelompokMKRequest> = z.object({
        namaKelompokMk: z.string().max(50).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });

    static readonly ID_KELOMPOK_MK: ZodType<string> = z.string().uuid();
}