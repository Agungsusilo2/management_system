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
exports.SemesterController = void 0;
const semester_service_1 = require("../service/semester-service");
const logging_1 = require("../application/logging");
const response_error_1 = require("../error/response-error");
class AuthUtil {
    static authorizeAdmin(user) {
        if (!user || user.user_type !== 'Admin') {
            throw new response_error_1.ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }
}
class SemesterController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                AuthUtil.authorizeAdmin(req.user);
                const request = req.body;
                const response = yield semester_service_1.SemesterService.create(request);
                logging_1.logger.debug(response);
                res.status(201).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                AuthUtil.authorizeAdmin(req.user);
                const kodeSemester = req.params.kodeSemester;
                const response = yield semester_service_1.SemesterService.get(kodeSemester);
                logging_1.logger.debug(response);
                res.status(200).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                AuthUtil.authorizeAdmin(req.user);
                const kodeSemester = req.params.kodeSemester;
                const request = req.body;
                const response = yield semester_service_1.SemesterService.update(kodeSemester, request);
                logging_1.logger.debug(response);
                res.status(200).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static remove(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                AuthUtil.authorizeAdmin(req.user);
                const kodeSemester = req.params.kodeSemester;
                yield semester_service_1.SemesterService.remove(kodeSemester);
                logging_1.logger.debug("Semester removed successfully");
                res.status(200).json({ data: "OK" });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static search(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                AuthUtil.authorizeAdmin(req.user);
                const request = {
                    semesterInt: req.query.semesterInt ? Number(req.query.semesterInt) : undefined,
                    page: req.query.page ? Number(req.query.page) : undefined,
                    size: req.query.size ? Number(req.query.size) : undefined,
                };
                const [response, total] = yield semester_service_1.SemesterService.search(request);
                logging_1.logger.debug(response);
                res.status(200).json({
                    data: response,
                    paging: {
                        page: request.page || 1,
                        size: request.size || 10,
                        total_item: total,
                        total_page: Math.ceil(total / (request.size || 10))
                    }
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.SemesterController = SemesterController;
