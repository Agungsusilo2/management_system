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
const validation_1 = require("../validation/validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
const mata_kuliah_validation_1 = require("../validation/mata-kuliah-validation");
const mata_kuliah_model_1 = require("../model/mata-kuliah-model"); // Adjust path as needed
class MataKuliahService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(mata_kuliah_validation_1.MataKuliahValidation.CREATE, request);
            // Check if IDMK already exists
            const existingMataKuliah = yield database_1.prismaClient.mataKuliah.count({
                where: { IDMK: createRequest.idmk }
            });
            if (existingMataKuliah > 0) {
                throw new response_error_1.ResponseError(400, "Mata Kuliah with this IDMK already exists");
            }
            const newMataKuliah = yield database_1.prismaClient.mataKuliah.create({
                data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ IDMK: createRequest.idmk, NamaMK: createRequest.namaMk }, (createRequest.kodeSemester && { semester: { connect: { KodeSemester: createRequest.kodeSemester } } })), (createRequest.jenisMKId && { jenis_mk: { connect: { id_jenis_mk: createRequest.jenisMKId } } })), (createRequest.kelompokMKId && { kelompok_mk: { connect: { id_kelompok_mk: createRequest.kelompokMKId } } })), (createRequest.lingkupKelasId && { lingkup_kelas: { connect: { id_lingkup_kelas: createRequest.lingkupKelasId } } })), (createRequest.modeKuliahId && { mode_kuliah: { connect: { id_mode_kuliah: createRequest.modeKuliahId } } })), (createRequest.metodePembelajaranId && { metode_pembelajaran: { connect: { id_metode_pembelajaran: createRequest.metodePembelajaranId } } })),
            });
            return (0, mata_kuliah_model_1.toMataKuliahResponse)(newMataKuliah);
        });
    }
    static get(idmk) {
        return __awaiter(this, void 0, void 0, function* () {
            idmk = validation_1.Validation.validate(mata_kuliah_validation_1.MataKuliahValidation.IDMK, idmk);
            const mataKuliah = yield database_1.prismaClient.mataKuliah.findUnique({
                where: { IDMK: idmk },
                include: {
                    semester: true,
                    sksMataKuliah: true,
                    jenis_mk: true,
                    kelompok_mk: true,
                    lingkup_kelas: true,
                    mode_kuliah: true,
                    metode_pembelajaran: true,
                }
            });
            if (!mataKuliah) {
                throw new response_error_1.ResponseError(404, "Mata Kuliah not found");
            }
            return (0, mata_kuliah_model_1.toMataKuliahResponse)(mataKuliah);
        });
    }
    static update(idmk, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            idmk = validation_1.Validation.validate(mata_kuliah_validation_1.MataKuliahValidation.IDMK, idmk);
            const updateRequest = validation_1.Validation.validate(mata_kuliah_validation_1.MataKuliahValidation.UPDATE, request);
            const existingMataKuliah = yield database_1.prismaClient.mataKuliah.findUnique({
                where: { IDMK: idmk }
            });
            if (!existingMataKuliah) {
                throw new response_error_1.ResponseError(404, "Mata Kuliah not found");
            }
            const updateData = {
                NamaMK: (_a = updateRequest.namaMk) !== null && _a !== void 0 ? _a : existingMataKuliah.NamaMK,
            };
            if (updateRequest.kodeSemester !== undefined) {
                updateData.semester = updateRequest.kodeSemester === null
                    ? { disconnect: true }
                    : { connect: { KodeSemester: updateRequest.kodeSemester } };
            }
            if (updateRequest.jenisMKId !== undefined) {
                updateData.jenis_mk = updateRequest.jenisMKId === null
                    ? { disconnect: true }
                    : { connect: { id_jenis_mk: updateRequest.jenisMKId } };
            }
            if (updateRequest.kelompokMKId !== undefined) {
                updateData.kelompok_mk = updateRequest.kelompokMKId === null
                    ? { disconnect: true }
                    : { connect: { id_kelompok_mk: updateRequest.kelompokMKId } };
            }
            if (updateRequest.lingkupKelasId !== undefined) {
                updateData.lingkup_kelas = updateRequest.lingkupKelasId === null
                    ? { disconnect: true }
                    : { connect: { id_lingkup_kelas: updateRequest.lingkupKelasId } };
            }
            if (updateRequest.modeKuliahId !== undefined) {
                updateData.mode_kuliah = updateRequest.modeKuliahId === null
                    ? { disconnect: true }
                    : { connect: { id_mode_kuliah: updateRequest.modeKuliahId } };
            }
            if (updateRequest.metodePembelajaranId !== undefined) {
                updateData.metode_pembelajaran = updateRequest.metodePembelajaranId === null
                    ? { disconnect: true }
                    : { connect: { id_metode_pembelajaran: updateRequest.metodePembelajaranId } };
            }
            const updatedMataKuliah = yield database_1.prismaClient.mataKuliah.update({
                where: { IDMK: idmk },
                data: updateData,
                include: {
                    semester: true,
                    sksMataKuliah: true,
                    jenis_mk: true,
                    kelompok_mk: true,
                    lingkup_kelas: true,
                    mode_kuliah: true,
                    metode_pembelajaran: true,
                }
            });
            return (0, mata_kuliah_model_1.toMataKuliahResponse)(updatedMataKuliah);
        });
    }
    static remove(idmk) {
        return __awaiter(this, void 0, void 0, function* () {
            idmk = validation_1.Validation.validate(mata_kuliah_validation_1.MataKuliahValidation.IDMK, idmk);
            const existingMataKuliahCount = yield database_1.prismaClient.mataKuliah.count({
                where: { IDMK: idmk }
            });
            if (existingMataKuliahCount === 0) {
                throw new response_error_1.ResponseError(404, "Mata Kuliah not found");
            }
            const bkmkCount = yield database_1.prismaClient.bKMK.count({ where: { IDMK: idmk } });
            if (bkmkCount > 0) {
                throw new response_error_1.ResponseError(400, "Cannot delete Mata Kuliah: still referenced by BKMK");
            }
            const cplmkCount = yield database_1.prismaClient.cPLMK.count({ where: { IDMK: idmk } });
            if (cplmkCount > 0) {
                throw new response_error_1.ResponseError(400, "Cannot delete Mata Kuliah: still referenced by CPLMK");
            }
            const cplbkmkCount = yield database_1.prismaClient.cPLBKMK.count({ where: { IDMK: idmk } });
            if (cplbkmkCount > 0) {
                throw new response_error_1.ResponseError(400, "Cannot delete Mata Kuliah: still referenced by CPLBKMK");
            }
            const mlcpmksubmkCount = yield database_1.prismaClient.mLCPMKSubMK.count({ where: { IDMK: idmk } });
            if (mlcpmksubmkCount > 0) {
                throw new response_error_1.ResponseError(400, "Cannot delete Mata Kuliah: still referenced by MLCPMKSubMK");
            }
            const cplcpmkmkCount = yield database_1.prismaClient.cPLCPMKMK.count({ where: { IDMK: idmk } });
            if (cplcpmkmkCount > 0) {
                throw new response_error_1.ResponseError(400, "Cannot delete Mata Kuliah: still referenced by CPLCPMKMK");
            }
            yield database_1.prismaClient.mataKuliah.delete({
                where: { IDMK: idmk }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(mata_kuliah_validation_1.MataKuliahValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.idmk) {
                filters.push({ IDMK: { contains: searchRequest.idmk, mode: 'insensitive' } });
            }
            if (searchRequest.namaMk) {
                filters.push({ NamaMK: { contains: searchRequest.namaMk, mode: 'insensitive' } });
            }
            if (searchRequest.kodeSemester) {
                filters.push({ KodeSemester: searchRequest.kodeSemester });
            }
            if (searchRequest.jenisMKId) {
                filters.push({ jenisMKId: searchRequest.jenisMKId });
            }
            if (searchRequest.kelompokMKId) {
                filters.push({ kelompokMKId: searchRequest.kelompokMKId });
            }
            if (searchRequest.lingkupKelasId) {
                filters.push({ lingkupKelasId: searchRequest.lingkupKelasId });
            }
            if (searchRequest.modeKuliahId) {
                filters.push({ modeKuliahId: searchRequest.modeKuliahId });
            }
            if (searchRequest.metodePembelajaranId) {
                filters.push({ metodePembelajaranId: searchRequest.metodePembelajaranId });
            }
            const [mataKuliahs, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.mataKuliah.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    orderBy: { IDMK: 'asc' },
                    include: {
                        semester: true,
                        sksMataKuliah: true,
                        jenis_mk: true,
                        kelompok_mk: true,
                        lingkup_kelas: true,
                        mode_kuliah: true,
                        metode_pembelajaran: true,
                    }
                }),
                database_1.prismaClient.mataKuliah.count({ where: { AND: filters } })
            ]);
            const responses = mataKuliahs.map(mata_kuliah_model_1.toMataKuliahResponse);
            return [responses, total];
        });
    }
}
exports.MataKuliahService = MataKuliahService;
