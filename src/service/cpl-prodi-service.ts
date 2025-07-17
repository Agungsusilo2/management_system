
import {
    CreateCPLProdiRequest,
    CPLProdiResponse,
    UpdateCPLProdiRequest,
    SearchCPLProdiRequest,
    toCPLProdiResponse
} from "../model/cpl-prodi-model";
import { Validation } from "../validation/validation";
import { CPLProdiValidation } from "../validation/cpl-prodi-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class CPLProdiService {

    static async create(request: CreateCPLProdiRequest): Promise<CPLProdiResponse> {
        const createRequest = Validation.validate(CPLProdiValidation.CREATE, request);

        const existingCPL = await prismaClient.cPLProdi.count({
            where: { KodeCPL: createRequest.kodeCPL }
        });
        if (existingCPL > 0) {
            throw new ResponseError(400, "CPL Prodi with this KodeCPL already exists");
        }

        if (createRequest.kodeAspek) {
            const aspekExists = await prismaClient.aspek.count({ where: { KodeAspek: createRequest.kodeAspek } });
            if (aspekExists === 0) {
                throw new ResponseError(400, "Aspek ID not found");
            }
        }

        const data: any = {
            KodeCPL: createRequest.kodeCPL,
            DeskripsiCPL: createRequest.deskripsiCPL,
        };

        if (createRequest.kodeAspek !== undefined && createRequest.kodeAspek !== null) {
            data.KodeAspek = createRequest.kodeAspek;
        }


        const newCPL = await prismaClient.cPLProdi.create({
            data: data,
            include: { aspek: true }
        });

        return toCPLProdiResponse(newCPL);
    }

    static async get(kodeCPL: string): Promise<CPLProdiResponse> {
        kodeCPL = Validation.validate(CPLProdiValidation.KODE_CPL, kodeCPL);

        const cpl = await prismaClient.cPLProdi.findUnique({
            where: { KodeCPL: kodeCPL },
            include: { aspek: true }
        });

        if (!cpl) {
            throw new ResponseError(404, "CPL Prodi not found");
        }

        return toCPLProdiResponse(cpl);
    }

    static async update(kodeCPL: string, request: UpdateCPLProdiRequest): Promise<CPLProdiResponse> {
        kodeCPL = Validation.validate(CPLProdiValidation.KODE_CPL, kodeCPL);
        const updateRequest = Validation.validate(CPLProdiValidation.UPDATE, request);

        const existingCPL = await prismaClient.cPLProdi.findUnique({
            where: { KodeCPL: kodeCPL }
        });

        if (!existingCPL) {
            throw new ResponseError(404, "CPL Prodi not found");
        }

        if (updateRequest.kodeAspek) {
            const aspekExists = await prismaClient.aspek.count({ where: { KodeAspek: updateRequest.kodeAspek } });
            if (aspekExists === 0) {
                throw new ResponseError(400, "Aspek ID not found");
            }
        }

        const updateData: any = {
            DeskripsiCPL: updateRequest.deskripsiCPL ?? existingCPL.DeskripsiCPL,
        };

        if (updateRequest.kodeAspek !== undefined) {
            updateData.KodeAspek = updateRequest.kodeAspek;
        } else {

            updateData.KodeAspek = existingCPL.KodeAspek;
        }


        const updatedCPL = await prismaClient.cPLProdi.update({
            where: { KodeCPL: kodeCPL },
            data: updateData,
            include: { aspek: true }
        });

        return toCPLProdiResponse(updatedCPL);
    }

    static async remove(kodeCPL: string): Promise<void> {
        kodeCPL = Validation.validate(CPLProdiValidation.KODE_CPL, kodeCPL);

        const existingCPLCount = await prismaClient.cPLProdi.count({
            where: { KodeCPL: kodeCPL }
        });

        if (existingCPLCount === 0) {
            throw new ResponseError(404, "CPL Prodi not found");
        }

        await prismaClient.cPLProdi.delete({
            where: { KodeCPL: kodeCPL }
        });
    }

    static async search(request: SearchCPLProdiRequest): Promise<[CPLProdiResponse[], number]> {
        const searchRequest = Validation.validate(CPLProdiValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters = [];

        if (searchRequest.deskripsiCPL) {
            filters.push({
                DeskripsiCPL: {
                    contains: searchRequest.deskripsiCPL,
                    mode: 'insensitive'
                }
            });
        }
        if (searchRequest.kodeAspek) {
            filters.push({
                KodeAspek: searchRequest.kodeAspek
            });
        }

        const [cplProdiList, total] = await prismaClient.$transaction([
            prismaClient.cPLProdi.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                include: { aspek: true },
                orderBy: { KodeCPL: 'asc' }
            }),
            prismaClient.cPLProdi.count({ where: { AND: filters } })
        ]);

        const responses = cplProdiList.map(toCPLProdiResponse);

        return [responses, total];
    }
}