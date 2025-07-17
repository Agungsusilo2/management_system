
import { SubCPMKResponse, CreateSubCPMKRequest, UpdateSubCPMKRequest, SearchSubCPMKRequest, toSubCPMKResponse } from "../model/sub-cpmk-model";
import { Validation } from "../validation/validation";
import { SubCPMKValidation } from "../validation/sub-cpmk-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class SubCPMKService {

    static async create(request: CreateSubCPMKRequest): Promise<SubCPMKResponse> {
        const createRequest = Validation.validate(SubCPMKValidation.CREATE, request);

        const existingSubCPMK = await prismaClient.subCPMK.count({
            where: { SubCPMK: createRequest.subCPMKId }
        });
        if (existingSubCPMK > 0) {
            throw new ResponseError(400, "SubCPMK with this ID already exists");
        }

        const newSubCPMK = await prismaClient.subCPMK.create({
            data: {
                SubCPMK: createRequest.subCPMKId,
                UraianSubCPMK: createRequest.uraianSubCPMK,
            },
        });

        return toSubCPMKResponse(newSubCPMK);
    }

    static async get(subCPMKId: string): Promise<SubCPMKResponse> {
        subCPMKId = Validation.validate(SubCPMKValidation.SUB_CPMK_ID, subCPMKId);

        const subCpmk = await prismaClient.subCPMK.findUnique({
            where: { SubCPMK: subCPMKId },
        });

        if (!subCpmk) {
            throw new ResponseError(404, "SubCPMK not found");
        }

        return toSubCPMKResponse(subCpmk);
    }

    static async update(subCPMKId: string, request: UpdateSubCPMKRequest): Promise<SubCPMKResponse> {
        subCPMKId = Validation.validate(SubCPMKValidation.SUB_CPMK_ID, subCPMKId);
        const updateRequest = Validation.validate(SubCPMKValidation.UPDATE, request);

        const existingSubCPMK = await prismaClient.subCPMK.findUnique({
            where: { SubCPMK: subCPMKId }
        });

        if (!existingSubCPMK) {
            throw new ResponseError(404, "SubCPMK not found");
        }

        const updatedSubCPMK = await prismaClient.subCPMK.update({
            where: { SubCPMK: subCPMKId },
            data: {
                UraianSubCPMK: updateRequest.uraianSubCPMK ?? existingSubCPMK.UraianSubCPMK,
            }
        });

        return toSubCPMKResponse(updatedSubCPMK);
    }

    static async remove(subCPMKId: string): Promise<void> {
        subCPMKId = Validation.validate(SubCPMKValidation.SUB_CPMK_ID, subCPMKId);

        const existingSubCPMKCount = await prismaClient.subCPMK.count({
            where: { SubCPMK: subCPMKId }
        });

        if (existingSubCPMKCount === 0) {
            throw new ResponseError(404, "SubCPMK not found");
        }

        const cpmkCount = await prismaClient.cPMK.count({
            where: { SubCPMK: subCPMKId }
        });
        if (cpmkCount > 0) {
            throw new ResponseError(400, "Cannot delete SubCPMK: still referenced by CPMK");
        }

        await prismaClient.subCPMK.delete({
            where: { SubCPMK: subCPMKId }
        });
    }

    static async search(request: SearchSubCPMKRequest): Promise<[SubCPMKResponse[], number]> {
        const searchRequest = Validation.validate(SubCPMKValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters = [];

        if (searchRequest.uraianSubCPMK) {
            filters.push({
                UraianSubCPMK: {
                    contains: searchRequest.uraianSubCPMK,
                    mode: 'insensitive'
                }
            });
        }

        const [subCpmkList, total] = await prismaClient.$transaction([
            prismaClient.subCPMK.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                orderBy: { SubCPMK: 'asc' }
            }),
            prismaClient.subCPMK.count({ where: { AND: filters } })
        ]);

        const responses = subCpmkList.map(toSubCPMKResponse);

        return [responses, total];
    }
}