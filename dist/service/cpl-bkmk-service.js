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
exports.CPLBKMKService = void 0;
const cpl_bkmk_model_1 = require("../model/cpl-bkmk-model");
const validation_1 = require("../validation/validation");
const cpl_bkmk_validation_1 = require("../validation/cpl-bkmk-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class CPLBKMKService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(cpl_bkmk_validation_1.CPLBKMKValidation.LINK_UNLINK, request);
            const cplExists = yield database_1.prismaClient.cPLProdi.count({ where: { KodeCPL: createRequest.kodeCPL } });
            if (cplExists === 0) {
                throw new response_error_1.ResponseError(404, "CPL Prodi not found");
            }
            const bkExists = yield database_1.prismaClient.bahanKajian.count({ where: { KodeBK: createRequest.kodeBK } });
            if (bkExists === 0) {
                throw new response_error_1.ResponseError(404, "Bahan Kajian not found");
            }
            const mkExists = yield database_1.prismaClient.mataKuliah.count({ where: { IDMK: createRequest.idmk } });
            if (mkExists === 0) {
                throw new response_error_1.ResponseError(404, "Mata Kuliah not found");
            }
            const existingLink = yield database_1.prismaClient.cPLBKMK.count({
                where: {
                    KodeCPL: createRequest.kodeCPL,
                    KodeBK: createRequest.kodeBK,
                    IDMK: createRequest.idmk,
                }
            });
            if (existingLink > 0) {
                throw new response_error_1.ResponseError(400, "CPL-BK-MK link already exists");
            }
            const newLink = yield database_1.prismaClient.cPLBKMK.create({
                data: {
                    KodeCPL: createRequest.kodeCPL,
                    KodeBK: createRequest.kodeBK,
                    IDMK: createRequest.idmk,
                },
                include: { cplProdi: true, bahanKajian: true, mataKuliah: true } // Sertakan detail relasi untuk response
            });
            return (0, cpl_bkmk_model_1.toCPLBKMKResponse)(newLink);
        });
    }
    static remove(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteRequest = validation_1.Validation.validate(cpl_bkmk_validation_1.CPLBKMKValidation.LINK_UNLINK, request);
            const existingLink = yield database_1.prismaClient.cPLBKMK.count({
                where: {
                    KodeCPL: deleteRequest.kodeCPL,
                    KodeBK: deleteRequest.kodeBK,
                    IDMK: deleteRequest.idmk,
                }
            });
            if (existingLink === 0) {
                throw new response_error_1.ResponseError(404, "CPL-BK-MK link not found");
            }
            yield database_1.prismaClient.cPLBKMK.delete({
                where: {
                    KodeCPL_KodeBK_IDMK: {
                        KodeCPL: deleteRequest.kodeCPL,
                        KodeBK: deleteRequest.kodeBK,
                        IDMK: deleteRequest.idmk,
                    }
                }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(cpl_bkmk_validation_1.CPLBKMKValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.kodeCPL) {
                filters.push({ KodeCPL: searchRequest.kodeCPL });
            }
            if (searchRequest.kodeBK) {
                filters.push({ KodeBK: searchRequest.kodeBK });
            }
            if (searchRequest.idmk) {
                filters.push({ IDMK: searchRequest.idmk });
            }
            const [cplBkmkList, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.cPLBKMK.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    include: { cplProdi: true, bahanKajian: true, mataKuliah: true }, // Sertakan detail relasi
                    orderBy: { KodeCPL: 'asc' }
                }),
                database_1.prismaClient.cPLBKMK.count({ where: { AND: filters } })
            ]);
            const responses = cplBkmkList.map(cpl_bkmk_model_1.toCPLBKMKResponse);
            return [responses, total];
        });
    }
}
exports.CPLBKMKService = CPLBKMKService;
