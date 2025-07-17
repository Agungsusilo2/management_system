// src/controller/ml-cpmk-submk-controller.ts

import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";
import { CreateMLCPMKSubMKRequest, DeleteMLCPMKSubMKRequest, SearchMLCPMKSubMKRequest } from "../model/ml-cpmk-submk-model";
import { MLCPMKSubMKService } from "../service/ml-cpmk-submk-service";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";

export class MLCPMKSubMKController {

    private static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }

    // --- CREATE (Link) ---
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            MLCPMKSubMKController.authorizeAdmin(req.user);
            const request: CreateMLCPMKSubMKRequest = req.body as CreateMLCPMKSubMKRequest;
            const response = await MLCPMKSubMKService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- REMOVE (Unlink) ---
    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            MLCPMKSubMKController.authorizeAdmin(req.user);
            const request: DeleteMLCPMKSubMKRequest = req.body as DeleteMLCPMKSubMKRequest;
            await MLCPMKSubMKService.remove(request);

            logger.debug("ML-CPMK-SubMK link removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    // --- SEARCH / LIST ---
    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            MLCPMKSubMKController.authorizeAdmin(req.user); // Admin-only SEARCH
            const request: SearchMLCPMKSubMKRequest = {
                idmk: req.query.idmk as string | undefined,
                kodeCPMK: req.query.kodeCPMK as string | undefined,
                subCPMKId: req.query.subCPMKId as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await MLCPMKSubMKService.search(request);

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