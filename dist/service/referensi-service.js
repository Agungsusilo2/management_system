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
exports.ReferensiService = void 0;
const referensi_model_1 = require("../model/referensi-model");
const validation_1 = require("../validation/validation");
const referensi_validation_1 = require("../validation/referensi-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class ReferensiService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(referensi_validation_1.ReferensiValidation.CREATE, request);
            const existingReferensi = yield database_1.prismaClient.referensi.count({
                where: { KodeReferensi: createRequest.kodeReferensi }
            });
            if (existingReferensi > 0) {
                throw new response_error_1.ResponseError(400, "Referensi with this KodeReferensi already exists");
            }
            const newReferensi = yield database_1.prismaClient.referensi.create({
                data: {
                    KodeReferensi: createRequest.kodeReferensi,
                    Referensi: createRequest.namaReferensi,
                },
            });
            return (0, referensi_model_1.toReferensiResponse)(newReferensi);
        });
    }
    static get(kodeReferensi) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeReferensi = validation_1.Validation.validate(referensi_validation_1.ReferensiValidation.KODE_REFERENSI, kodeReferensi);
            const referensi = yield database_1.prismaClient.referensi.findUnique({
                where: { KodeReferensi: kodeReferensi },
            });
            if (!referensi) {
                throw new response_error_1.ResponseError(404, "Referensi not found");
            }
            return (0, referensi_model_1.toReferensiResponse)(referensi);
        });
    }
    static update(kodeReferensi, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            kodeReferensi = validation_1.Validation.validate(referensi_validation_1.ReferensiValidation.KODE_REFERENSI, kodeReferensi);
            const updateRequest = validation_1.Validation.validate(referensi_validation_1.ReferensiValidation.UPDATE, request);
            const existingReferensi = yield database_1.prismaClient.referensi.findUnique({
                where: { KodeReferensi: kodeReferensi }
            });
            if (!existingReferensi) {
                throw new response_error_1.ResponseError(404, "Referensi not found");
            }
            const updatedReferensi = yield database_1.prismaClient.referensi.update({
                where: { KodeReferensi: kodeReferensi },
                data: {
                    Referensi: (_a = updateRequest.namaReferensi) !== null && _a !== void 0 ? _a : existingReferensi.Referensi,
                }
            });
            return (0, referensi_model_1.toReferensiResponse)(updatedReferensi);
        });
    }
    static remove(kodeReferensi) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeReferensi = validation_1.Validation.validate(referensi_validation_1.ReferensiValidation.KODE_REFERENSI, kodeReferensi);
            const existingReferensiCount = yield database_1.prismaClient.referensi.count({
                where: { KodeReferensi: kodeReferensi }
            });
            if (existingReferensiCount === 0) {
                throw new response_error_1.ResponseError(404, "Referensi not found");
            }
            const bahanKajianCount = yield database_1.prismaClient.bahanKajian.count({
                where: { KodeReferensi: kodeReferensi }
            });
            if (bahanKajianCount > 0) {
                throw new response_error_1.ResponseError(400, "Cannot delete Referensi: still referenced by Bahan Kajian");
            }
            yield database_1.prismaClient.referensi.delete({
                where: { KodeReferensi: kodeReferensi }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(referensi_validation_1.ReferensiValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.namaReferensi) {
                filters.push({
                    Referensi: {
                        contains: searchRequest.namaReferensi,
                        mode: 'insensitive'
                    }
                });
            }
            const [referensis, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.referensi.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    orderBy: { KodeReferensi: 'asc' }
                }),
                database_1.prismaClient.referensi.count({ where: { AND: filters } })
            ]);
            const responses = referensis.map(referensi_model_1.toReferensiResponse);
            return [responses, total];
        });
    }
}
exports.ReferensiService = ReferensiService;
