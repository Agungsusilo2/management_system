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
exports.MataKuliahService = void 0;
const mata_kuliah_model_1 = require("../model/mata-kuliah-model");
const validation_1 = require("../validation/validation");
const mata_kuliah_validation_1 = require("../validation/mata-kuliah-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class MataKuliahService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(mata_kuliah_validation_1.MataKuliahValidation.CREATE, request);
            const existingMK = yield database_1.prismaClient.mataKuliah.count({
                where: { IDMK: createRequest.idmk }
            });
            if (existingMK > 0) {
                throw new response_error_1.ResponseError(400, "Mata Kuliah with this IDMK already exists");
            }
            const newMK = yield database_1.prismaClient.mataKuliah.create({
                data: {
                    IDMK: createRequest.idmk,
                    NamaMK: createRequest.namaMk,
                },
            });
            return (0, mata_kuliah_model_1.toMataKuliahResponse)(newMK);
        });
    }
    static get(idmk) {
        return __awaiter(this, void 0, void 0, function* () {
            idmk = validation_1.Validation.validate(mata_kuliah_validation_1.MataKuliahValidation.IDMK, idmk);
            const mk = yield database_1.prismaClient.mataKuliah.findUnique({
                where: { IDMK: idmk },
            });
            if (!mk) {
                throw new response_error_1.ResponseError(404, "Mata Kuliah not found");
            }
            return (0, mata_kuliah_model_1.toMataKuliahResponse)(mk);
        });
    }
    static update(idmk, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            idmk = validation_1.Validation.validate(mata_kuliah_validation_1.MataKuliahValidation.IDMK, idmk);
            const updateRequest = validation_1.Validation.validate(mata_kuliah_validation_1.MataKuliahValidation.UPDATE, request);
            const existingMK = yield database_1.prismaClient.mataKuliah.findUnique({
                where: { IDMK: idmk }
            });
            if (!existingMK) {
                throw new response_error_1.ResponseError(404, "Mata Kuliah not found");
            }
            const updatedMK = yield database_1.prismaClient.mataKuliah.update({
                where: { IDMK: idmk },
                data: {
                    NamaMK: (_a = updateRequest.namaMk) !== null && _a !== void 0 ? _a : existingMK.NamaMK,
                }
            });
            return (0, mata_kuliah_model_1.toMataKuliahResponse)(updatedMK);
        });
    }
    static remove(idmk) {
        return __awaiter(this, void 0, void 0, function* () {
            idmk = validation_1.Validation.validate(mata_kuliah_validation_1.MataKuliahValidation.IDMK, idmk);
            const existingMKCount = yield database_1.prismaClient.mataKuliah.count({
                where: { IDMK: idmk }
            });
            if (existingMKCount === 0) {
                throw new response_error_1.ResponseError(404, "Mata Kuliah not found");
            }
            yield database_1.prismaClient.mataKuliah.delete({
                where: { IDMK: idmk }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const searchRequest = validation_1.Validation.validate(mata_kuliah_validation_1.MataKuliahValidation.SEARCH, request);
            const page = (_a = searchRequest.page) !== null && _a !== void 0 ? _a : 1;
            const size = (_b = searchRequest.size) !== null && _b !== void 0 ? _b : 10;
            const skip = (page - 1) * size;
            const filters = [];
            if (searchRequest.namaMk) {
                filters.push({
                    NamaMK: {
                        contains: searchRequest.namaMk,
                        mode: 'insensitive',
                    }
                });
            }
            const [mataKuliahList, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.mataKuliah.findMany({
                    where: { AND: filters },
                    take: size,
                    skip: skip,
                    orderBy: { IDMK: 'asc' },
                }),
                database_1.prismaClient.mataKuliah.count({
                    where: { AND: filters }
                })
            ]);
            const responses = mataKuliahList.map(mata_kuliah_model_1.toMataKuliahResponse);
            return [responses, total];
        });
    }
}
exports.MataKuliahService = MataKuliahService;
