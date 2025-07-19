import {
    CreateMetodePembelajaranRequest,
    MetodePembelajaranResponse, SearchMetodePembelajaranRequest,
    UpdateMetodePembelajaranRequest
} from "../model/metode-pembelajaran-model";
import {MetodePembelajaranService} from "../service/motede-pembelajaran-service";
import {UserRequest} from "../type/user-request";
import {NextFunction,Response} from "express";
import {logger} from "../application/logging";
import {ResponseError} from "../error/response-error";

class AuthUtil {
    static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }
}


export class MetodePembelajaranController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const request: CreateMetodePembelajaranRequest = req.body as CreateMetodePembelajaranRequest;
            const response: MetodePembelajaranResponse = await MetodePembelajaranService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const idMetodePembelajaran: string = req.params.idMetodePembelajaran;
            const response: MetodePembelajaranResponse = await MetodePembelajaranService.get(idMetodePembelajaran);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const idMetodePembelajaran: string = req.params.idMetodePembelajaran;
            const request: UpdateMetodePembelajaranRequest = req.body as UpdateMetodePembelajaranRequest;
            const response: MetodePembelajaranResponse = await MetodePembelajaranService.update(idMetodePembelajaran, request);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const idMetodePembelajaran: string = req.params.idMetodePembelajaran;
            await MetodePembelajaranService.remove(idMetodePembelajaran);

            logger.debug("Metode Pembelajaran removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const request: SearchMetodePembelajaranRequest = {
                namaMetodePembelajaran: req.query.namaMetodePembelajaran as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await MetodePembelajaranService.search(request);

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
