
import { z, ZodType } from "zod";
import { CreateCPLMKRequest, DeleteCPLMKRequest, SearchCPLMKRequest } from "../model/cpl-mk-model";

export class CPLMKValidation {
    static readonly LINK_UNLINK: ZodType<CreateCPLMKRequest | DeleteCPLMKRequest> = z.object({
        kodeCPL: z.string().max(50),
        idmk: z.string().max(50),
    });

    static readonly SEARCH: ZodType<SearchCPLMKRequest> = z.object({
        kodeCPL: z.string().max(50).optional(),
        idmk: z.string().max(50).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });
}