
import { ProfesiResponse, UpdateProfesiRequest, toProfesiResponse } from "../model/profesi-model";
import { Validation } from "../validation/validation";
import { ProfesiValidation } from "../validation/profesi-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {z} from "zod";


export class ProfesiService {


    static async update(kodeProfesi: string, request: UpdateProfesiRequest): Promise<ProfesiResponse> {
        kodeProfesi = Validation.validate(ProfesiValidation.KODE_PROFESI, kodeProfesi);
        const updateRequest = Validation.validate(ProfesiValidation.UPDATE, request);

        const existingProfesi = await prismaClient.profesi.findUnique({
            where: { KodeProfesi: kodeProfesi }
        });

        if (!existingProfesi) {
            throw new ResponseError(404, "Profesi not found");
        }

        const updatedProfesi = await prismaClient.profesi.update({
            where: { KodeProfesi: kodeProfesi },
            data: {
                Profesi: updateRequest.namaProfesi ?? existingProfesi.Profesi,
            }
        });

        return toProfesiResponse(updatedProfesi);
    }

    static async remove(kodeProfesi: string): Promise<void> {
        kodeProfesi = Validation.validate(ProfesiValidation.KODE_PROFESI, kodeProfesi);

        const existingProfesiCount = await prismaClient.profesi.count({
            where: { KodeProfesi: kodeProfesi }
        });

        if (existingProfesiCount === 0) {
            throw new ResponseError(404, "Profesi not found");
        }

        const profilLulusanCount = await prismaClient.profilLulusan.count({
            where: { KodeProfesi: kodeProfesi }
        });
        if (profilLulusanCount > 0) {
            throw new ResponseError(400, "Cannot delete Profesi: still referenced by Profil Lulusan");
        }

        await prismaClient.profesi.delete({
            where: { KodeProfesi: kodeProfesi }
        });
    }

    static async get(kodeProfesi: string): Promise<ProfesiResponse> {
        kodeProfesi = Validation.validate(ProfesiValidation.KODE_PROFESI, kodeProfesi);

        const profesi = await prismaClient.profesi.findUnique({
            where: { KodeProfesi: kodeProfesi }
        });


        if (!profesi) {
            throw new ResponseError(404, "Profesi not found");
        }
        return toProfesiResponse(profesi);
    }

    static async getAll(): Promise<ProfesiResponse[]> {
        const profesi = await prismaClient.profesi.findMany();

        return profesi.map((data) => toProfesiResponse(data));
    }



    static async create(request: { KodeProfesi: string, Profesi: string }): Promise<ProfesiResponse> {
        const createRequest = z.object({
            KodeProfesi: z.string().max(50),
            Profesi: z.string().min(1).max(255),
        }).parse(request);

        const existingCount = await prismaClient.profesi.count({ where: { KodeProfesi: createRequest.KodeProfesi } });
        if (existingCount > 0) {
            throw new ResponseError(400, "Profesi with this ID already exists");
        }

        const newProfesi = await prismaClient.profesi.create({ data: createRequest });
        return toProfesiResponse(newProfesi);
    }
}