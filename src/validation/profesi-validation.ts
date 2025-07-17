
import { z, ZodType } from "zod";
import { UpdateProfesiRequest } from "../model/profesi-model";

export class ProfesiValidation {
    static readonly UPDATE: ZodType<UpdateProfesiRequest> = z.object({
        namaProfesi: z.string().min(1).max(255).optional(),
    });

    static readonly KODE_PROFESI: ZodType<string> = z.string().max(50);


}