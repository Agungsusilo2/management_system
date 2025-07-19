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
exports.ModeKuliahService = void 0;
const mode_kuliah_1 = require("../model/mode-kuliah");
const validation_1 = require("../validation/validation");
const mode_kuliah_validation_1 = require("../validation/mode-kuliah-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class ModeKuliahService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(mode_kuliah_validation_1.ModeKuliahValidation.CREATE, request);
            const existingModeKuliah = yield database_1.prismaClient.modeKuliah.count({
                where: { nama_mode_kuliah: createRequest.namaModeKuliah }
            });
            if (existingModeKuliah > 0) {
                throw new response_error_1.ResponseError(400, "Mode Kuliah with this name already exists");
            }
            const newModeKuliah = yield database_1.prismaClient.modeKuliah.create({
                data: {
                    nama_mode_kuliah: createRequest.namaModeKuliah,
                },
            });
            return (0, mode_kuliah_1.toModeKuliahResponse)(newModeKuliah);
        });
    }
    static get(idModeKuliah) {
        return __awaiter(this, void 0, void 0, function* () {
            idModeKuliah = validation_1.Validation.validate(mode_kuliah_validation_1.ModeKuliahValidation.ID_MODE_KULIAH, idModeKuliah);
            const modeKuliah = yield database_1.prismaClient.modeKuliah.findUnique({
                where: { id_mode_kuliah: idModeKuliah },
            });
            if (!modeKuliah) {
                throw new response_error_1.ResponseError(404, "Mode Kuliah not found");
            }
            return (0, mode_kuliah_1.toModeKuliahResponse)(modeKuliah);
        });
    }
    static update(idModeKuliah, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            idModeKuliah = validation_1.Validation.validate(mode_kuliah_validation_1.ModeKuliahValidation.ID_MODE_KULIAH, idModeKuliah);
            const updateRequest = validation_1.Validation.validate(mode_kuliah_validation_1.ModeKuliahValidation.UPDATE, request);
            const existingModeKuliah = yield database_1.prismaClient.modeKuliah.findUnique({
                where: { id_mode_kuliah: idModeKuliah }
            });
            if (!existingModeKuliah) {
                throw new response_error_1.ResponseError(404, "Mode Kuliah not found");
            }
            if (updateRequest.namaModeKuliah && updateRequest.namaModeKuliah !== existingModeKuliah.nama_mode_kuliah) {
                const conflictCount = yield database_1.prismaClient.modeKuliah.count({
                    where: { nama_mode_kuliah: updateRequest.namaModeKuliah }
                });
                if (conflictCount > 0) {
                    throw new response_error_1.ResponseError(400, "Another Mode Kuliah with this name already exists");
                }
            }
            const updatedModeKuliah = yield database_1.prismaClient.modeKuliah.update({
                where: { id_mode_kuliah: idModeKuliah },
                data: {
                    nama_mode_kuliah: (_a = updateRequest.namaModeKuliah) !== null && _a !== void 0 ? _a : existingModeKuliah.nama_mode_kuliah,
                }
            });
            return (0, mode_kuliah_1.toModeKuliahResponse)(updatedModeKuliah);
        });
    }
    static remove(idModeKuliah) {
        return __awaiter(this, void 0, void 0, function* () {
            idModeKuliah = validation_1.Validation.validate(mode_kuliah_validation_1.ModeKuliahValidation.ID_MODE_KULIAH, idModeKuliah);
            const existingModeKuliahCount = yield database_1.prismaClient.modeKuliah.count({
                where: { id_mode_kuliah: idModeKuliah }
            });
            if (existingModeKuliahCount === 0) {
                throw new response_error_1.ResponseError(404, "Mode Kuliah not found");
            }
            const mataKuliahCount = yield database_1.prismaClient.mataKuliah.count({
                where: { modeKuliahId: idModeKuliah } // Perhatikan nama kolom FK di MataKuliah
            });
            if (mataKuliahCount > 0) {
                throw new response_error_1.ResponseError(400, "Cannot delete Mode Kuliah: still referenced by Mata Kuliah");
            }
            yield database_1.prismaClient.modeKuliah.delete({
                where: { id_mode_kuliah: idModeKuliah }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(mode_kuliah_validation_1.ModeKuliahValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.namaModeKuliah) {
                filters.push({
                    nama_mode_kuliah: {
                        contains: searchRequest.namaModeKuliah,
                        mode: 'insensitive'
                    }
                });
            }
            const [modeKuliahs, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.modeKuliah.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    orderBy: { nama_mode_kuliah: 'asc' }
                }),
                database_1.prismaClient.modeKuliah.count({ where: { AND: filters } })
            ]);
            const responses = modeKuliahs.map(mode_kuliah_1.toModeKuliahResponse);
            return [responses, total];
        });
    }
}
exports.ModeKuliahService = ModeKuliahService;
