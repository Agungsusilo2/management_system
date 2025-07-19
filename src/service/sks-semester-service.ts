import {
    CreateSKSMataKuliahRequest, SearchSKSMataKuliahRequest,
    SKSMataKuliahResponse,
    toSKSMataKuliahResponse, UpdateSKSMataKuliahRequest
} from "../model/sks-matakuliah-model";
import {Validation} from "../validation/validation";
import {SKSMataKuliahValidation} from "../validation/sks-mata-kuliah-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";

export class SKSMataKuliahService {
    static async create(request: CreateSKSMataKuliahRequest): Promise<SKSMataKuliahResponse> {
        const createRequest = Validation.validate(SKSMataKuliahValidation.CREATE, request);

        const existingSKS = await prismaClient.sKSMataKuliah.count({
            where: { IDMK: createRequest.idmk }
        });
        if (existingSKS > 0) {
            throw new ResponseError(400, "SKS data for this Mata Kuliah already exists");
        }

        const newSKSMataKuliah = await prismaClient.sKSMataKuliah.create({
            data: {
                BobotTatapMuka: createRequest.bobotTatapMuka,
                BobotPraktikum: createRequest.bobotPraktikum,
                BobotPraktekLapangan: createRequest.bobotPraktekLapangan,
                BobotSimulasi: createRequest.bobotSimulasi,
                TotalBobot: createRequest.bobotTatapMuka + createRequest.bobotPraktikum + createRequest.bobotPraktekLapangan + createRequest.bobotSimulasi,
                mataKuliah: {
                    connect: { IDMK: createRequest.idmk }
                }
            },
        });

        return toSKSMataKuliahResponse(newSKSMataKuliah);
    }

    static async get(kodeSKS: string): Promise<SKSMataKuliahResponse> {
        kodeSKS = Validation.validate(SKSMataKuliahValidation.KODE_SKS, kodeSKS);

        const sksMataKuliah = await prismaClient.sKSMataKuliah.findUnique({
            where: { KodeSKS: kodeSKS },
        });

        if (!sksMataKuliah) {
            throw new ResponseError(404, "SKS Mata Kuliah not found");
        }

        return toSKSMataKuliahResponse(sksMataKuliah);
    }

    static async update(kodeSKS: string, request: UpdateSKSMataKuliahRequest): Promise<SKSMataKuliahResponse> {
        kodeSKS = Validation.validate(SKSMataKuliahValidation.KODE_SKS, kodeSKS);
        const updateRequest = Validation.validate(SKSMataKuliahValidation.UPDATE, request);

        const existingSKSMataKuliah = await prismaClient.sKSMataKuliah.findUnique({
            where: { KodeSKS: kodeSKS }
        });

        if (!existingSKSMataKuliah) {
            throw new ResponseError(404, "SKS Mata Kuliah not found");
        }

        const updatedData: any = {
            BobotTatapMuka: updateRequest.bobotTatapMuka ?? existingSKSMataKuliah.BobotTatapMuka,
            BobotPraktikum: updateRequest.bobotPraktikum ?? existingSKSMataKuliah.BobotPraktikum,
            BobotPraktekLapangan: updateRequest.bobotPraktekLapangan ?? existingSKSMataKuliah.BobotPraktekLapangan,
            BobotSimulasi: updateRequest.bobotSimulasi ?? existingSKSMataKuliah.BobotSimulasi,
        };

        if (updateRequest.bobotTatapMuka !== undefined ||
            updateRequest.bobotPraktikum !== undefined ||
            updateRequest.bobotPraktekLapangan !== undefined ||
            updateRequest.bobotSimulasi !== undefined) {
            updatedData.TotalBobot = (updateRequest.bobotTatapMuka ?? existingSKSMataKuliah.BobotTatapMuka) +
                (updateRequest.bobotPraktikum ?? existingSKSMataKuliah.BobotPraktikum) +
                (updateRequest.bobotPraktekLapangan ?? existingSKSMataKuliah.BobotPraktekLapangan) +
                (updateRequest.bobotSimulasi ?? existingSKSMataKuliah.BobotSimulasi);
        }

        const updatedSKSMataKuliah = await prismaClient.sKSMataKuliah.update({
            where: { KodeSKS: kodeSKS },
            data: updatedData
        });

        return toSKSMataKuliahResponse(updatedSKSMataKuliah);
    }

    static async remove(kodeSKS: string): Promise<void> {
        kodeSKS = Validation.validate(SKSMataKuliahValidation.KODE_SKS, kodeSKS);

        const existingSKSMataKuliahCount = await prismaClient.sKSMataKuliah.count({
            where: { KodeSKS: kodeSKS }
        });

        if (existingSKSMataKuliahCount === 0) {
            throw new ResponseError(404, "SKS Mata Kuliah not found");
        }

        await prismaClient.sKSMataKuliah.delete({
            where: { KodeSKS: kodeSKS }
        });
    }

    static async search(request: SearchSKSMataKuliahRequest): Promise<[SKSMataKuliahResponse[], number]> {
        const searchRequest = Validation.validate(SKSMataKuliahValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters: any[] = [];

        if (searchRequest.idmk) {
            filters.push({
                IDMK: searchRequest.idmk
            });
        }

        const [sksMataKuliahs, total] = await prismaClient.$transaction([
            prismaClient.sKSMataKuliah.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                orderBy: { KodeSKS: 'asc' }
            }),
            prismaClient.sKSMataKuliah.count({ where: { AND: filters } })
        ]);

        const responses = sksMataKuliahs.map(toSKSMataKuliahResponse);

        return [responses, total];
    }
}