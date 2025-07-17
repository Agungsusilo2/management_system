
import { z, ZodType } from "zod";
import { CreateMLCPMKSubMKRequest, DeleteMLCPMKSubMKRequest, SearchMLCPMKSubMKRequest } from "../model/ml-cpmk-submk-model";

export class MLCPMKSubMKValidation {
    static readonly LINK_UNLINK: ZodType<CreateMLCPMKSubMKRequest | DeleteMLCPMKSubMKRequest> = z.object({
        idmk: z.string().max(50),
        kodeCPMK: z.string().max(50),
        subCPMKId: z.string().max(50),
    });

    static readonly SEARCH: ZodType<SearchMLCPMKSubMKRequest> = z.object({
        idmk: z.string().max(50).optional(),
        kodeCPMK: z.string().max(50).optional(),
        subCPMKId: z.string().max(50).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });
}