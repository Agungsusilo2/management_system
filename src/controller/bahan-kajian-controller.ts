// src/controller/bahan-kajian-controller.ts

import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";
import { CreateBahanKajianRequest, UpdateBahanKajianRequest, SearchBahanKajianRequest } from "../model/bahan-kajian-model";
import { BahanKajianService } from "../service/bahan-kajian-service";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";

export class BahanKajianController {

    private static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }

    // --- CREATE ---
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            BahanKajianController.authorizeAdmin(req.user);
            const request: CreateBahanKajianRequest = req.body as CreateBahanKajianRequest;
            const response = await BahanKajianService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- GET by ID ---
    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            BahanKajianController.authorizeAdmin(req.user); // Admin-only GET
            const kodeBK: string = req.params.kodeBK;
            const response = await BahanKajianService.get(kodeBK);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- UPDATE ---
    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            BahanKajianController.authorizeAdmin(req.user);
            const kodeBK: string = req.params.kodeBK;
            const request: UpdateBahanKajianRequest = req.body as UpdateBahanKajianRequest;
            const response = await BahanKajianService.update(kodeBK, request);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- DELETE ---
    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            BahanKajianController.authorizeAdmin(req.user);
            const kodeBK: string = req.params.kodeBK;
            await BahanKajianService.remove(kodeBK);

            logger.debug("Bahan Kajian removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    // --- SEARCH / LIST ---
    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            BahanKajianController.authorizeAdmin(req.user); // Admin-only SEARCH
            const request: SearchBahanKajianRequest = {
                namaBahanKajian: req.query.namaBahanKajian as string | undefined,
                kodeReferensi: req.query.kodeReferensi as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await BahanKajianService.search(request);

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