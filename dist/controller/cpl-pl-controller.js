"use strict";
// src/controller/cpl-pl-controller.ts
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
exports.CPLPLController = void 0;
const cpl_pl_service_1 = require("../service/cpl-pl-service");
const logging_1 = require("../application/logging");
const response_error_1 = require("../error/response-error");
class CPLPLController {
    static authorizeAdmin(user) {
        if (!user || user.user_type !== 'Admin') {
            throw new response_error_1.ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }
    // --- CREATE (Link) ---
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                CPLPLController.authorizeAdmin(req.user);
                const request = req.body;
                const response = yield cpl_pl_service_1.CPLPLService.create(request);
                logging_1.logger.debug(response);
                res.status(201).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
    // --- REMOVE (Unlink) ---
    static remove(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                CPLPLController.authorizeAdmin(req.user);
                // Untuk DELETE, kita perlu kedua ID dari body atau dari params
                // Contoh menggunakan body untuk composite key:
                const request = req.body;
                yield cpl_pl_service_1.CPLPLService.remove(request);
                logging_1.logger.debug("CPL-PL link removed successfully");
                res.status(200).json({ data: "OK" });
            }
            catch (e) {
                next(e);
            }
        });
    }
    // --- SEARCH / LIST ---
    static search(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                CPLPLController.authorizeAdmin(req.user); // Admin-only SEARCH
                const request = {
                    kodeCPL: req.query.kodeCPL,
                    kodePL: req.query.kodePL,
                    page: req.query.page ? Number(req.query.page) : undefined,
                    size: req.query.size ? Number(req.query.size) : undefined,
                };
                const [response, total] = yield cpl_pl_service_1.CPLPLService.search(request);
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
exports.CPLPLController = CPLPLController;
