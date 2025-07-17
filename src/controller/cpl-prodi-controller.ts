// src/controller/cpl-prodi-controller.ts

import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request"; // Pastikan path ini benar
import {
    CreateCPLProdiRequest,
    UpdateCPLProdiRequest,
    SearchCPLProdiRequest
} from "../model/cpl-prodi-model";
import { CPLProdiService } from "../service/cpl-prodi-service";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";

export class CPLProdiController {

    private static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }

    // --- CREATE ---
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPLProdiController.authorizeAdmin(req.user);
            const request: CreateCPLProdiRequest = req.body as CreateCPLProdiRequest;
            const response = await CPLProdiService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- GET by ID ---
    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPLProdiController.authorizeAdmin(req.user); // Admin-only GET
            const kodeCPL: string = req.params.kodeCPL;
            const response = await CPLProdiService.get(kodeCPL);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- UPDATE ---
    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPLProdiController.authorizeAdmin(req.user);
            const kodeCPL: string = req.params.kodeCPL;
            const request: UpdateCPLProdiRequest = req.body as UpdateCPLProdiRequest;
            const response = await CPLProdiService.update(kodeCPL, request);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- DELETE ---
    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPLProdiController.authorizeAdmin(req.user);
            const kodeCPL: string = req.params.kodeCPL;
            await CPLProdiService.remove(kodeCPL);

            logger.debug("CPL Prodi removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    // --- SEARCH / LIST ---
    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPLProdiController.authorizeAdmin(req.user); // Admin-only SEARCH
            const request: SearchCPLProdiRequest = {
                deskripsiCPL: req.query.deskripsiCPL as string | undefined,
                kodeAspek: req.query.kodeAspek as string | undefined,
                // Hapus programStudiId: req.query.programStudiId as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await CPLProdiService.search(request);

            logger.debug(response);
            res.status(200).json({
                data: response,
                paging: {
                    page: request.page || 1,
                    size: request.size || 10,
                    total_item: total,
                    total_page: Math.ceil(total / (request.size || 10))
                }
            });
        } catch (e) {
            next(e);
        }
    }
}