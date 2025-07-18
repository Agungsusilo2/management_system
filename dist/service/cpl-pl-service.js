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
exports.CPLPLService = void 0;
const cpl_pl_model_1 = require("../model/cpl-pl-model");
const validation_1 = require("../validation/validation");
const cpl_pl_validation_1 = require("../validation/cpl-pl-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class CPLPLService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(cpl_pl_validation_1.CPLPLValidation.LINK_UNLINK, request);
            const cplExists = yield database_1.prismaClient.cPLProdi.count({ where: { KodeCPL: createRequest.kodeCPL } });
            if (cplExists === 0) {
                throw new response_error_1.ResponseError(404, "CPL Prodi not found");
            }
            const plExists = yield database_1.prismaClient.profilLulusan.count({ where: { KodePL: createRequest.kodePL } });
            if (plExists === 0) {
                throw new response_error_1.ResponseError(404, "Profil Lulusan not found");
            }
            const existingLink = yield database_1.prismaClient.cPLPL.count({
                where: {
                    KodeCPL: createRequest.kodeCPL,
                    KodePL: createRequest.kodePL,
                }
            });
            if (existingLink > 0) {
                throw new response_error_1.ResponseError(400, "CPL-PL link already exists");
            }
            const newLink = yield database_1.prismaClient.cPLPL.create({
                data: {
                    KodeCPL: createRequest.kodeCPL,
                    KodePL: createRequest.kodePL,
                },
                include: { cplProdi: true, profilLulusan: true }
            });
            return (0, cpl_pl_model_1.toCPLPLResponse)(newLink);
        });
    }
    static remove(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteRequest = validation_1.Validation.validate(cpl_pl_validation_1.CPLPLValidation.LINK_UNLINK, request);
            const existingLink = yield database_1.prismaClient.cPLPL.count({
                where: {
                    KodeCPL: deleteRequest.kodeCPL,
                    KodePL: deleteRequest.kodePL,
                }
            });
            if (existingLink === 0) {
                throw new response_error_1.ResponseError(404, "CPL-PL link not found");
            }
            yield database_1.prismaClient.cPLPL.delete({
                where: {
                    KodeCPL_KodePL: {
                        KodeCPL: deleteRequest.kodeCPL,
                        KodePL: deleteRequest.kodePL,
                    }
                }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(cpl_pl_validation_1.CPLPLValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.kodeCPL) {
                filters.push({ KodeCPL: searchRequest.kodeCPL });
            }
            if (searchRequest.kodePL) {
                filters.push({ KodePL: searchRequest.kodePL });
            }
            const [cplPlList, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.cPLPL.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    include: { cplProdi: true, profilLulusan: true },
                    orderBy: { KodeCPL: 'asc' }
                }),
                database_1.prismaClient.cPLPL.count({ where: { AND: filters } })
            ]);
            const responses = cplPlList.map(cpl_pl_model_1.toCPLPLResponse);
            return [responses, total];
        });
    }
}
exports.CPLPLService = CPLPLService;
