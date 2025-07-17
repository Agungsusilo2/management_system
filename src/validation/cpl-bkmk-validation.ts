
import { z, ZodType } from "zod";
import { CreateCPLBKMKRequest, DeleteCPLBKMKRequest, SearchCPLBKMKRequest } from "../model/cpl-bkmk-model";

export class CPLBKMKValidation {
    static readonly LINK_UNLINK: ZodType<CreateCPLBKMKRequest | DeleteCPLBKMKRequest> = z.object({
        kodeCPL: z.string().max(50),
        kodeBK: z.string().max(50),
        idmk: z.string().max(50),
    });

    static readonly SEARCH: ZodType<SearchCPLBKMKRequest> = z.object({
        kodeCPL: z.string().max(50).optional(),
        kodeBK: z.string().max(50).optional(),
        idmk: z.string().max(50).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });
}