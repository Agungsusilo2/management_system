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
exports.SemesterService = void 0;
const semester_model_1 = require("../model/semester-model");
const validation_1 = require("../validation/validation");
const semester_validation_1 = require("../validation/semester-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class SemesterService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(semester_validation_1.SemesterValidation.CREATE, request);
            const existingSemester = yield database_1.prismaClient.semester.count({
                where: {
                    SemesterInt: createRequest.semesterInt,
                }
            });
            if (existingSemester > 0) {
                throw new response_error_1.ResponseError(400, "Semester with this number already exists.");
            }
            const newSemester = yield database_1.prismaClient.semester.create({
                data: {
                    SemesterInt: createRequest.semesterInt,
                },
            });
            return (0, semester_model_1.toSemesterResponse)(newSemester);
        });
    }
    static get(kodeSemester) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeSemester = validation_1.Validation.validate(semester_validation_1.SemesterValidation.KODE_SEMESTER, kodeSemester);
            const semester = yield database_1.prismaClient.semester.findUnique({
                where: { KodeSemester: kodeSemester },
            });
            if (!semester) {
                throw new response_error_1.ResponseError(404, "Semester not found");
            }
            return (0, semester_model_1.toSemesterResponse)(semester);
        });
    }
    static update(kodeSemester, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            kodeSemester = validation_1.Validation.validate(semester_validation_1.SemesterValidation.KODE_SEMESTER, kodeSemester);
            const updateRequest = validation_1.Validation.validate(semester_validation_1.SemesterValidation.UPDATE, request);
            const existingSemester = yield database_1.prismaClient.semester.findUnique({
                where: { KodeSemester: kodeSemester }
            });
            if (!existingSemester) {
                throw new response_error_1.ResponseError(404, "Semester not found");
            }
            const updatedSemester = yield database_1.prismaClient.semester.update({
                where: { KodeSemester: kodeSemester },
                data: {
                    SemesterInt: (_a = updateRequest.semesterInt) !== null && _a !== void 0 ? _a : existingSemester.SemesterInt,
                }
            });
            return (0, semester_model_1.toSemesterResponse)(updatedSemester);
        });
    }
    static remove(kodeSemester) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeSemester = validation_1.Validation.validate(semester_validation_1.SemesterValidation.KODE_SEMESTER, kodeSemester);
            const existingSemesterCount = yield database_1.prismaClient.semester.count({
                where: { KodeSemester: kodeSemester }
            });
            if (existingSemesterCount === 0) {
                throw new response_error_1.ResponseError(404, "Semester not found");
            }
            const mataKuliahCount = yield database_1.prismaClient.mataKuliah.count({
                where: { KodeSemester: kodeSemester }
            });
            if (mataKuliahCount > 0) {
                throw new response_error_1.ResponseError(400, "Cannot delete Semester: still referenced by Mata Kuliah");
            }
            yield database_1.prismaClient.semester.delete({
                where: { KodeSemester: kodeSemester }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(semester_validation_1.SemesterValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.semesterInt) {
                filters.push({
                    SemesterInt: searchRequest.semesterInt
                });
            }
            const [semesters, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.semester.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    orderBy: { SemesterInt: 'asc' }
                }),
                database_1.prismaClient.semester.count({ where: { AND: filters } })
            ]);
            const responses = semesters.map(semester_model_1.toSemesterResponse);
            return [responses, total];
        });
    }
}
exports.SemesterService = SemesterService;
