import {CreateJenisMKRequest, SearchJenisMKRequest, UpdateJenisMKRequest} from "../model/jenis-mk";
import {z, ZodType} from "zod";

export class JenisMKValidation {
    static readonly CREATE: ZodType<CreateJenisMKRequest> = z.object({
        namaJenisMk: z.string().min(1).max(50),
    });

    static readonly UPDATE: ZodType<UpdateJenisMKRequest> = z.object({
        namaJenisMk: z.string().min(1).max(50).optional(),
    });

    static readonly SEARCH: ZodType<SearchJenisMKRequest> = z.object({
        namaJenisMk: z.string().max(50).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });

    static readonly ID_JENIS_MK: ZodType<string> = z.string().uuid();
}