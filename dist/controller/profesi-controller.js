"use strict";
// src/controller/profesi-controller.ts
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
exports.ProfesiController = void 0;
const profesi_service_1 = require("../service/profesi-service");
const logging_1 = require("../application/logging");
const response_error_1 = require("../error/response-error");
class ProfesiController {
    static authorizeAdmin(user) {
        if (!user || user.user_type !== 'Admin') {
            throw new response_error_1.ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                ProfesiController.authorizeAdmin(req.user);
                const kodeProfesi = req.params.kodeProfesi;
                const request = req.body;
                const response = yield profesi_service_1.ProfesiService.update(kodeProfesi, request);
                logging_1.logger.debug(response);
                res.status(200).json({
                    data: response
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static remove(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                ProfesiController.authorizeAdmin(req.user);
                const kodeProfesi = req.params.kodeProfesi;
                yield profesi_service_1.ProfesiService.remove(kodeProfesi);
                logging_1.logger.debug("Profesi removed successfully");
                res.status(200).json({
                    data: "OK"
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                ProfesiController.authorizeAdmin(req.user);
                const request = req.body;
                const response = yield profesi_service_1.ProfesiService.create(request);
                logging_1.logger.debug(response);
                res.status(201).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield profesi_service_1.ProfesiService.getAll();
                res.status(200).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Jika hanya admin: ProfesiController.authorizeAdmin(req.user);
                const kodeProfesi = req.params.kodeProfesi;
                const response = yield profesi_service_1.ProfesiService.get(kodeProfesi);
                res.status(200).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.ProfesiController = ProfesiController;
