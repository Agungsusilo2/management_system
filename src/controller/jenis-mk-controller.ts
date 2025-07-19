import { UserRequest } from "../type/user-request";
import {NextFunction,Response} from "express";
import {CreateJenisMKRequest, JenisMKResponse, SearchJenisMKRequest, UpdateJenisMKRequest} from "../model/jenis-mk";
import {JenisMKService} from "../service/jenis-mk-service";
import {logger} from "../application/logging";
import {ResponseError} from "../error/response-error";

class AuthUtil {
    static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }
}

// --- JenisMK Controller ---
export class JenisMKController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const request: CreateJenisMKRequest = req.body as CreateJenisMKRequest;
            const response: JenisMKResponse = await JenisMKService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const idJenisMk: string = req.params.idJenisMk;
            const response: JenisMKResponse = await JenisMKService.get(idJenisMk);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const idJenisMk: string = req.params.idJenisMk;
            const request: UpdateJenisMKRequest = req.body as UpdateJenisMKRequest;
            const response: JenisMKResponse = await JenisMKService.update(idJenisMk, request);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const idJenisMk: string = req.params.idJenisMk;
            await JenisMKService.remove(idJenisMk);

            logger.debug("Jenis MK removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const request: SearchJenisMKRequest = {
                namaJenisMk: req.query.namaJenisMk as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await JenisMKService.search(request);

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