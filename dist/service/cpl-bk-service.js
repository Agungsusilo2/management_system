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
exports.CPLBKService = void 0;
const cpl_bk_model_1 = require("../model/cpl-bk-model");
const validation_1 = require("../validation/validation");
const cpl_bk_validation_1 = require("../validation/cpl-bk-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class CPLBKService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(cpl_bk_validation_1.CPLBKValidation.LINK_UNLINK, request);
            const cplExists = yield database_1.prismaClient.cPLProdi.count({ where: { KodeCPL: createRequest.kodeCPL } });
            if (cplExists === 0) {
                throw new response_error_1.ResponseError(404, "CPL Prodi not found");
            }
            const bkExists = yield database_1.prismaClient.bahanKajian.count({ where: { KodeBK: createRequest.kodeBK } });
            if (bkExists === 0) {
                throw new response_error_1.ResponseError(404, "Bahan Kajian not found");
            }
            const existingLink = yield database_1.prismaClient.cPLBK.count({
                where: {
                    KodeCPL: createRequest.kodeCPL,
                    KodeBK: createRequest.kodeBK,
                }
            });
            if (existingLink > 0) {
                throw new response_error_1.ResponseError(400, "CPL-BK link already exists");
            }
            const newLink = yield database_1.prismaClient.cPLBK.create({
                data: {
                    KodeCPL: createRequest.kodeCPL,
                    KodeBK: createRequest.kodeBK,
                },
                include: { cplProdi: true, bahanKajian: true } // Sertakan detail relasi untuk response
            });
            return (0, cpl_bk_model_1.toCPLBKResponse)(newLink);
        });
    }
    static remove(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteRequest = validation_1.Validation.validate(cpl_bk_validation_1.CPLBKValidation.LINK_UNLINK, request);
            const existingLink = yield database_1.prismaClient.cPLBK.count({
                where: {
                    KodeCPL: deleteRequest.kodeCPL,
                    KodeBK: deleteRequest.kodeBK,
                }
            });
            if (existingLink === 0) {
                throw new response_error_1.ResponseError(404, "CPL-BK link not found");
            }
            yield database_1.prismaClient.cPLBK.delete({
                where: {
                    KodeCPL_KodeBK: {
                        KodeCPL: deleteRequest.kodeCPL,
                        KodeBK: deleteRequest.kodeBK,
                    }
                }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(cpl_bk_validation_1.CPLBKValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.kodeCPL) {
                filters.push({ KodeCPL: searchRequest.kodeCPL });
            }
            if (searchRequest.kodeBK) {
                filters.push({ KodeBK: searchRequest.kodeBK });
            }
            const [cplBkList, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.cPLBK.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    include: { cplProdi: true, bahanKajian: true }, // Sertakan detail relasi
                    orderBy: { KodeCPL: 'asc' }
                }),
                database_1.prismaClient.cPLBK.count({ where: { AND: filters } })
            ]);
            const responses = cplBkList.map(cpl_bk_model_1.toCPLBKResponse);
            return [responses, total];
        });
    }
}
exports.CPLBKService = CPLBKService;
