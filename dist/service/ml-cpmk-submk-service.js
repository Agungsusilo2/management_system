"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MLCPMKSubMKService = void 0;
const ml_cpmk_submk_model_1 = require("../model/ml-cpmk-submk-model");
const validation_1 = require("../validation/validation");
const ml_cpmk_submk_validation_1 = require("../validation/ml-cpmk-submk-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class MLCPMKSubMKService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(ml_cpmk_submk_validation_1.MLCPMKSubMKValidation.LINK_UNLINK, request);
            const mkExists = yield database_1.prismaClient.mataKuliah.count({ where: { IDMK: createRequest.idmk } });
            if (mkExists === 0) {
                throw new response_error_1.ResponseError(404, "Mata Kuliah not found");
            }
            const cpmkExists = yield database_1.prismaClient.cPMK.count({ where: { KodeCPMK: createRequest.kodeCPMK } });
            if (cpmkExists === 0) {
                throw new response_error_1.ResponseError(404, "CPMK not found");
            }
            const subCpmkExists = yield database_1.prismaClient.subCPMK.count({ where: { SubCPMK: createRequest.subCPMKId } });
            if (subCpmkExists === 0) {
                throw new response_error_1.ResponseError(404, "SubCPMK not found");
            }
            const existingLink = yield database_1.prismaClient.mLCPMKSubMK.count({
                where: {
                    IDMK: createRequest.idmk,
                    KodeCPMK: createRequest.kodeCPMK,
                    SubCPMK: createRequest.subCPMKId,
                }
            });
            if (existingLink > 0) {
                throw new response_error_1.ResponseError(400, "ML-CPMK-SubMK link already exists");
            }
            const newLink = yield database_1.prismaClient.mLCPMKSubMK.create({
                data: {
                    IDMK: createRequest.idmk,
                    KodeCPMK: createRequest.kodeCPMK,
                    SubCPMK: createRequest.subCPMKId,
                },
                include: { mataKuliah: true, cpmk: true, subCPMK: true }
            });
            return (0, ml_cpmk_submk_model_1.toMLCPMKSubMKResponse)(newLink);
        });
    }
    static remove(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteRequest = validation_1.Validation.validate(ml_cpmk_submk_validation_1.MLCPMKSubMKValidation.LINK_UNLINK, request);
            const existingLink = yield database_1.prismaClient.mLCPMKSubMK.count({
                where: {
                    IDMK: deleteRequest.idmk,
                    KodeCPMK: deleteRequest.kodeCPMK,
                    SubCPMK: deleteRequest.subCPMKId,
                }
            });
            if (existingLink === 0) {
                throw new response_error_1.ResponseError(404, "ML-CPMK-SubMK link not found");
            }
            yield database_1.prismaClient.mLCPMKSubMK.delete({
                where: {
                    IDMK_KodeCPMK_SubCPMK: {
                        IDMK: deleteRequest.idmk,
                        KodeCPMK: deleteRequest.kodeCPMK,
                        SubCPMK: deleteRequest.subCPMKId,
                    }
                }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(ml_cpmk_submk_validation_1.MLCPMKSubMKValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
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
            const [mlCpmkSubMkList, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.mLCPMKSubMK.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    include: { mataKuliah: true, cpmk: true, subCPMK: true },
                    orderBy: { IDMK: 'asc' }
                }),
                database_1.prismaClient.mLCPMKSubMK.count({ where: { AND: filters } })
            ]);
            const responses = mlCpmkSubMkList.map(ml_cpmk_submk_model_1.toMLCPMKSubMKResponse);
            return [responses, total];
        });
    }
}
exports.MLCPMKSubMKService = MLCPMKSubMKService;
