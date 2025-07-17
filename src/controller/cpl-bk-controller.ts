// src/controller/cpl-bk-controller.ts

import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";
import { CreateCPLBKRequest, DeleteCPLBKRequest, SearchCPLBKRequest } from "../model/cpl-bk-model";
import { CPLBKService } from "../service/cpl-bk-service";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";

export class CPLBKController {

    private static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }

    // --- CREATE (Link) ---
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPLBKController.authorizeAdmin(req.user);
            const request: CreateCPLBKRequest = req.body as CreateCPLBKRequest;
            const response = await CPLBKService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- REMOVE (Unlink) ---
    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPLBKController.authorizeAdmin(req.user);
            const request: DeleteCPLBKRequest = req.body as DeleteCPLBKRequest;
            await CPLBKService.remove(request);

            logger.debug("CPL-BK link removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    // --- SEARCH / LIST ---
    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPLBKController.authorizeAdmin(req.user); // Admin-only SEARCH
            const request: SearchCPLBKRequest = {
                kodeCPL: req.query.kodeCPL as string | undefined,
                kodeBK: req.query.kodeBK as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await CPLBKService.search(request);

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