import {UserRequest} from "../type/user-request";
import {
    CreateKelompokMKRequest,
    KelompokMKResponse,
    SearchKelompokMKRequest,
    UpdateKelompokMKRequest
} from "../model/kelompok-mk-model";
import {NextFunction,Response} from "express";
import {KelompokMKService} from "../service/kelompok-mk-service";
import {logger} from "../application/logging";
import {ResponseError} from "../error/response-error";

class AuthUtil {
    static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }
}


export class KelompokMKController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const request: CreateKelompokMKRequest = req.body as CreateKelompokMKRequest;
            const response: KelompokMKResponse = await KelompokMKService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const idKelompokMk: string = req.params.idKelompokMk;
            const response: KelompokMKResponse = await KelompokMKService.get(idKelompokMk);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const idKelompokMk: string = req.params.idKelompokMk;
            const request: UpdateKelompokMKRequest = req.body as UpdateKelompokMKRequest;
            const response: KelompokMKResponse = await KelompokMKService.update(idKelompokMk, request);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const idKelompokMk: string = req.params.idKelompokMk;
            await KelompokMKService.remove(idKelompokMk);

            logger.debug("Kelompok MK removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const request: SearchKelompokMKRequest = {
                namaKelompokMk: req.query.namaKelompokMk as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await KelompokMKService.search(request);

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