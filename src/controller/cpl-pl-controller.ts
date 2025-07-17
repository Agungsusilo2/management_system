// src/controller/cpl-pl-controller.ts

import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";
import { CreateCPLPLRequest, DeleteCPLPLRequest, SearchCPLPLRequest } from "../model/cpl-pl-model";
import { CPLPLService } from "../service/cpl-pl-service";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";

export class CPLPLController {

    private static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }

    // --- CREATE (Link) ---
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPLPLController.authorizeAdmin(req.user);
            const request: CreateCPLPLRequest = req.body as CreateCPLPLRequest;
            const response = await CPLPLService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- REMOVE (Unlink) ---
    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPLPLController.authorizeAdmin(req.user);
            // Untuk DELETE, kita perlu kedua ID dari body atau dari params
            // Contoh menggunakan body untuk composite key:
            const request: DeleteCPLPLRequest = req.body as DeleteCPLPLRequest;
            await CPLPLService.remove(request);

            logger.debug("CPL-PL link removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    // --- SEARCH / LIST ---
    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPLPLController.authorizeAdmin(req.user); // Admin-only SEARCH
            const request: SearchCPLPLRequest = {
                kodeCPL: req.query.kodeCPL as string | undefined,
                kodePL: req.query.kodePL as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await CPLPLService.search(request);

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