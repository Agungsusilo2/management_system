
import { z, ZodType } from "zod";
import {CreateAspekRequest, SearchAspekRequest, UpdateAspekRequest} from "../model/aspek-model";

export class AspekValidation {
    static readonly CREATE: ZodType<CreateAspekRequest> = z.object({
        kodeAspek: z.string().max(50),
        namaAspek: z.string().min(1).max(255),
    });

    static readonly UPDATE: ZodType<UpdateAspekRequest> = z.object({
        namaAspek: z.string().min(1).max(255).optional(),
    });

    static readonly KODE_ASPEK: ZodType<string> = z.string().max(50);

    static readonly SEARCH: ZodType<SearchAspekRequest> = z.object({
        namaAspek: z.string().max(255).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });
}