// src/controller/referensi-controller.ts

import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";
import { CreateReferensiRequest, UpdateReferensiRequest, SearchReferensiRequest } from "../model/referensi-model";
import { ReferensiService } from "../service/referensi-service";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";

export class ReferensiController {

    private static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }

    // --- CREATE ---
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            ReferensiController.authorizeAdmin(req.user);
            const request: CreateReferensiRequest = req.body as CreateReferensiRequest;
            const response = await ReferensiService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- GET by ID ---
    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            ReferensiController.authorizeAdmin(req.user); // Admin-only GET
            const kodeReferensi: string = req.params.kodeReferensi;
            const response = await ReferensiService.get(kodeReferensi);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- UPDATE ---
    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            ReferensiController.authorizeAdmin(req.user);
            const kodeReferensi: string = req.params.kodeReferensi;
            const request: UpdateReferensiRequest = req.body as UpdateReferensiRequest;
            const response = await ReferensiService.update(kodeReferensi, request);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- DELETE ---
    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            ReferensiController.authorizeAdmin(req.user);
            const kodeReferensi: string = req.params.kodeReferensi;
            await ReferensiService.remove(kodeReferensi);

            logger.debug("Referensi removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    // --- SEARCH / LIST ---
    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            ReferensiController.authorizeAdmin(req.user); // Admin-only SEARCH
            const request: SearchReferensiRequest = {
                namaReferensi: req.query.namaReferensi as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await ReferensiService.search(request);

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