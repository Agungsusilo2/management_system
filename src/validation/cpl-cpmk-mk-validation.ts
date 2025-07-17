
import { z, ZodType } from "zod";
import { CreateCPLCPMKMKRequest, DeleteCPLCPMKMKRequest, SearchCPLCPMKMKRequest } from "../model/cpl-cpmk-mk-model";

export class CPLCPMKMKValidation {
    static readonly LINK_UNLINK: ZodType<CreateCPLCPMKMKRequest | DeleteCPLCPMKMKRequest> = z.object({
        kodeCPL: z.string().max(50),
        kodeCPMK: z.string().max(50),
        idmk: z.string().max(50),
    });

    static readonly SEARCH: ZodType<SearchCPLCPMKMKRequest> = z.object({
        kodeCPL: z.string().max(50).optional(),
        kodeCPMK: z.string().max(50).optional(),
        idmk: z.string().max(50).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });
}