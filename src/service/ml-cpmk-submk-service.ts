
import { MLCPMKSubMKResponse, CreateMLCPMKSubMKRequest, DeleteMLCPMKSubMKRequest, SearchMLCPMKSubMKRequest, toMLCPMKSubMKResponse } from "../model/ml-cpmk-submk-model";
import { Validation } from "../validation/validation";
import { MLCPMKSubMKValidation } from "../validation/ml-cpmk-submk-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class MLCPMKSubMKService {

    static async create(request: CreateMLCPMKSubMKRequest): Promise<MLCPMKSubMKResponse> {
        const createRequest = Validation.validate(MLCPMKSubMKValidation.LINK_UNLINK, request);

        const mkExists = await prismaClient.mataKuliah.count({ where: { IDMK: createRequest.idmk } });
        if (mkExists === 0) {
            throw new ResponseError(404, "Mata Kuliah not found");
        }
        const cpmkExists = await prismaClient.cPMK.count({ where: { KodeCPMK: createRequest.kodeCPMK } });
        if (cpmkExists === 0) {
            throw new ResponseError(404, "CPMK not found");
        }
        const subCpmkExists = await prismaClient.subCPMK.count({ where: { SubCPMK: createRequest.subCPMKId } });
        if (subCpmkExists === 0) {
            throw new ResponseError(404, "SubCPMK not found");
        }

        const existingLink = await prismaClient.mLCPMKSubMK.count({
            where: {
                IDMK: createRequest.idmk,
                KodeCPMK: createRequest.kodeCPMK,
                SubCPMK: createRequest.subCPMKId,
            }
        });
        if (existingLink > 0) {
            throw new ResponseError(400, "ML-CPMK-SubMK link already exists");
        }

        const newLink = await prismaClient.mLCPMKSubMK.create({
            data: {
                IDMK: createRequest.idmk,
                KodeCPMK: createRequest.kodeCPMK,
                SubCPMK: createRequest.subCPMKId,
            },
            include: { mataKuliah: true, cpmk: true, subCPMK: true }
        });

        return toMLCPMKSubMKResponse(newLink);
    }

    static async remove(request: DeleteMLCPMKSubMKRequest): Promise<void> {
        const deleteRequest = Validation.validate(MLCPMKSubMKValidation.LINK_UNLINK, request);

        const existingLink = await prismaClient.mLCPMKSubMK.count({
            where: {
                IDMK: deleteRequest.idmk,
                KodeCPMK: deleteRequest.kodeCPMK,
                SubCPMK: deleteRequest.subCPMKId,
            }
        });
        if (existingLink === 0) {
            throw new ResponseError(404, "ML-CPMK-SubMK link not found");
        }

        await prismaClient.mLCPMKSubMK.delete({
            where: {
                IDMK_KodeCPMK_SubCPMK: {
                    IDMK: deleteRequest.idmk,
                    KodeCPMK: deleteRequest.kodeCPMK,
                    SubCPMK: deleteRequest.subCPMKId,
                }
            }
        });
    }

    static async search(request: SearchMLCPMKSubMKRequest): Promise<[MLCPMKSubMKResponse[], number]> {
        const searchRequest = Validation.validate(MLCPMKSubMKValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters = [];

        if (searchRequest.idmk) {
            filters.push({ IDMK: searchRequest.idmk });
        }
        if (searchRequest.kodeCPMK) {
            filters.push({ KodeCPMK: searchRequest.kodeCPMK });
        }
        if (searchRequest.subCPMKId) {
            filters.push({ SubCPMK: searchRequest.subCPMKId });
        }

        const [mlCpmkSubMkList, total] = await prismaClient.$transaction([
            prismaClient.mLCPMKSubMK.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                include: { mataKuliah: true, cpmk: true, subCPMK: true },
                orderBy: { IDMK: 'asc' }
            }),
            prismaClient.mLCPMKSubMK.count({ where: { AND: filters } })
        ]);

        const responses = mlCpmkSubMkList.map(toMLCPMKSubMKResponse);

        return [responses, total];
    }
}