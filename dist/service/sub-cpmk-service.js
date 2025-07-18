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
exports.SubCPMKService = void 0;
const sub_cpmk_model_1 = require("../model/sub-cpmk-model");
const validation_1 = require("../validation/validation");
const sub_cpmk_validation_1 = require("../validation/sub-cpmk-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class SubCPMKService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(sub_cpmk_validation_1.SubCPMKValidation.CREATE, request);
            const existingSubCPMK = yield database_1.prismaClient.subCPMK.count({
                where: { SubCPMK: createRequest.subCPMKId }
            });
            if (existingSubCPMK > 0) {
                throw new response_error_1.ResponseError(400, "SubCPMK with this ID already exists");
            }
            const newSubCPMK = yield database_1.prismaClient.subCPMK.create({
                data: {
                    SubCPMK: createRequest.subCPMKId,
                    UraianSubCPMK: createRequest.uraianSubCPMK,
                },
            });
            return (0, sub_cpmk_model_1.toSubCPMKResponse)(newSubCPMK);
        });
    }
    static get(subCPMKId) {
        return __awaiter(this, void 0, void 0, function* () {
            subCPMKId = validation_1.Validation.validate(sub_cpmk_validation_1.SubCPMKValidation.SUB_CPMK_ID, subCPMKId);
            const subCpmk = yield database_1.prismaClient.subCPMK.findUnique({
                where: { SubCPMK: subCPMKId },
            });
            if (!subCpmk) {
                throw new response_error_1.ResponseError(404, "SubCPMK not found");
            }
            return (0, sub_cpmk_model_1.toSubCPMKResponse)(subCpmk);
        });
    }
    static update(subCPMKId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            subCPMKId = validation_1.Validation.validate(sub_cpmk_validation_1.SubCPMKValidation.SUB_CPMK_ID, subCPMKId);
            const updateRequest = validation_1.Validation.validate(sub_cpmk_validation_1.SubCPMKValidation.UPDATE, request);
            const existingSubCPMK = yield database_1.prismaClient.subCPMK.findUnique({
                where: { SubCPMK: subCPMKId }
            });
            if (!existingSubCPMK) {
                throw new response_error_1.ResponseError(404, "SubCPMK not found");
            }
            const updatedSubCPMK = yield database_1.prismaClient.subCPMK.update({
                where: { SubCPMK: subCPMKId },
                data: {
                    UraianSubCPMK: (_a = updateRequest.uraianSubCPMK) !== null && _a !== void 0 ? _a : existingSubCPMK.UraianSubCPMK,
                }
            });
            return (0, sub_cpmk_model_1.toSubCPMKResponse)(updatedSubCPMK);
        });
    }
    static remove(subCPMKId) {
        return __awaiter(this, void 0, void 0, function* () {
            subCPMKId = validation_1.Validation.validate(sub_cpmk_validation_1.SubCPMKValidation.SUB_CPMK_ID, subCPMKId);
            const existingSubCPMKCount = yield database_1.prismaClient.subCPMK.count({
                where: { SubCPMK: subCPMKId }
            });
            if (existingSubCPMKCount === 0) {
                throw new response_error_1.ResponseError(404, "SubCPMK not found");
            }
            const cpmkCount = yield database_1.prismaClient.cPMK.count({
                where: { SubCPMK: subCPMKId }
            });
            if (cpmkCount > 0) {
                throw new response_error_1.ResponseError(400, "Cannot delete SubCPMK: still referenced by CPMK");
            }
            yield database_1.prismaClient.subCPMK.delete({
                where: { SubCPMK: subCPMKId }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(sub_cpmk_validation_1.SubCPMKValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.uraianSubCPMK) {
                filters.push({
                    UraianSubCPMK: {
                        contains: searchRequest.uraianSubCPMK,
                        mode: 'insensitive'
                    }
                });
            }
            const [subCpmkList, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.subCPMK.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    orderBy: { SubCPMK: 'asc' }
                }),
                database_1.prismaClient.subCPMK.count({ where: { AND: filters } })
            ]);
            const responses = subCpmkList.map(sub_cpmk_model_1.toSubCPMKResponse);
            return [responses, total];
        });
    }
}
exports.SubCPMKService = SubCPMKService;
