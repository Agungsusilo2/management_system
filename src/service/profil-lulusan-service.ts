

import {
    CreateProfilLulusanRequest,
    ProfilLulusanResponse, SearchProfilLulusanRequest,
    toProfilLulusanResponse, UpdateProfilLulusanRequest
} from "../model/profile-lulusan-model";
import {Validation} from "../validation/validation";
import {ProfilLulusanValidation} from "../validation/profil-lulusan-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";

export class ProfilLulusanService {

    static async create(request: CreateProfilLulusanRequest): Promise<ProfilLulusanResponse> {
        const createRequest = Validation.validate(ProfilLulusanValidation.CREATE, request);

        const existingPl = await prismaClient.profilLulusan.count({
            where: { KodePL: createRequest.kodePL }
        });
        if (existingPl > 0) {
            throw new ResponseError(400, "Profil Lulusan with this ID already exists");
        }

        if (createRequest.kodeProfesi) {
            const profesiExists = await prismaClient.profesi.count({
                where: { KodeProfesi: createRequest.kodeProfesi }
            });
            if (profesiExists === 0) {
                throw new ResponseError(400, "Profesi ID not found");
            }
        }

        const data: any = {
            KodePL: createRequest.kodePL,
            ProfilLulusan: createRequest.deskripsi,
        };

        if (createRequest.kodeProfesi !== undefined) {
            data.KodeProfesi = createRequest.kodeProfesi;
        }

        const newPl = await prismaClient.profilLulusan.create({
            data,
            include: { profesi: true }
        });


        return toProfilLulusanResponse(newPl);
    }

    static async get(kodePL: string): Promise<ProfilLulusanResponse> {
        kodePL = Validation.validate(ProfilLulusanValidation.KODE_PL, kodePL);

        const pl = await prismaClient.profilLulusan.findUnique({
            where: { KodePL: kodePL },
            include: { profesi: true }
        });

        if (!pl) {
            throw new ResponseError(404, "Profil Lulusan not found");
        }

        return toProfilLulusanResponse(pl);
    }

    static async update(kodePL: string, request: UpdateProfilLulusanRequest): Promise<ProfilLulusanResponse> {
        kodePL = Validation.validate(ProfilLulusanValidation.KODE_PL, kodePL);
        const updateRequest = Validation.validate(ProfilLulusanValidation.UPDATE, request);

        const existingPl = await prismaClient.profilLulusan.findUnique({
            where: { KodePL: kodePL }
        });

        if (!existingPl) {
            throw new ResponseError(404, "Profil Lulusan not found");
        }

        if (updateRequest.kodeProfesi) {
            const profesiExists = await prismaClient.profesi.count({
                where: { KodeProfesi: updateRequest.kodeProfesi }
            });
            if (profesiExists === 0) {
                throw new ResponseError(400, "Profesi ID not found");
            }
        }

        const updatedPl = await prismaClient.profilLulusan.update({
            where: { KodePL: kodePL },
            data: {
                ProfilLulusan: updateRequest.deskripsi ?? existingPl.ProfilLulusan,
                KodeProfesi: updateRequest.kodeProfesi ?? existingPl.KodeProfesi,
            },
            include: { profesi: true }
        });

        return toProfilLulusanResponse(updatedPl);
    }

    static async remove(kodePL: string): Promise<void> {
        kodePL = Validation.validate(ProfilLulusanValidation.KODE_PL, kodePL);

        const existingPlCount = await prismaClient.profilLulusan.count({
            where: { KodePL: kodePL }
        });

        if (existingPlCount === 0) {
            throw new ResponseError(404, "Profil Lulusan not found");
        }

        await prismaClient.profilLulusan.delete({
            where: { KodePL: kodePL }
        });
    }

    static async search(request: SearchProfilLulusanRequest): Promise<[ProfilLulusanResponse[], number]> {
        const searchRequest = Validation.validate(ProfilLulusanValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters = [];

        if (searchRequest.deskripsi) {
            filters.push({
                ProfilLulusan: {
                    contains: searchRequest.deskripsi,
                    mode: 'insensitive'
                }
            });
        }
        if (searchRequest.kodeProfesi) {
            filters.push({
                KodeProfesi: searchRequest.kodeProfesi
            });
        }

        const [profilLulusanList, total] = await prismaClient.$transaction([
            prismaClient.profilLulusan.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                include: { profesi: true },
                orderBy: { KodePL: 'asc' }
            }),
            prismaClient.profilLulusan.count({ where: { AND: filters } })
        ]);

        const responses = profilLulusanList.map(toProfilLulusanResponse);

        return [responses, total];
    }
}