"use strict";
// src/controller/mata-kuliah-controller.ts
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
exports.MataKuliahController = void 0;
const mata_kuliah_service_1 = require("../service/mata-kuliah-service");
const logging_1 = require("../application/logging");
const response_error_1 = require("../error/response-error");
class MataKuliahController {
    static authorizeAdmin(user) {
        if (!user || user.user_type !== 'Admin') {
            throw new response_error_1.ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }
    // --- CREATE ---
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                MataKuliahController.authorizeAdmin(req.user);
                const request = req.body;
                const response = yield mata_kuliah_service_1.MataKuliahService.create(request);
                logging_1.logger.debug(response);
                res.status(201).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
    // --- GET by ID ---
    static get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                MataKuliahController.authorizeAdmin(req.user); // Admin-only GET
                const idmk = req.params.idmk;
                const response = yield mata_kuliah_service_1.MataKuliahService.get(idmk);
                logging_1.logger.debug(response);
                res.status(200).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
    // --- UPDATE ---
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                MataKuliahController.authorizeAdmin(req.user);
                const idmk = req.params.idmk;
                const request = req.body;
                const response = yield mata_kuliah_service_1.MataKuliahService.update(idmk, request);
                logging_1.logger.debug(response);
                res.status(200).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
    // --- DELETE ---
    static remove(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                MataKuliahController.authorizeAdmin(req.user);
                const idmk = req.params.idmk;
                yield mata_kuliah_service_1.MataKuliahService.remove(idmk);
                logging_1.logger.debug("Mata Kuliah removed successfully");
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
                MataKuliahController.authorizeAdmin(req.user); // Admin-only SEARCH
                const request = {
                    namaMk: req.query.namaMk,
                    page: req.query.page ? Number(req.query.page) : undefined,
                    size: req.query.size ? Number(req.query.size) : undefined,
                };
                const [response, total] = yield mata_kuliah_service_1.MataKuliahService.search(request);
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
exports.MataKuliahController = MataKuliahController;
