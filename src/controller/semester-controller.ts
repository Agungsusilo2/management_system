import {
    CreateSemesterRequest,
    SearchSemesterRequest,
    SemesterResponse,
    UpdateSemesterRequest
} from "../model/semester-model";
import {UserRequest} from "../type/user-request";
import {NextFunction,Response} from "express";
import {SemesterService} from "../service/semester-service";
import {logger} from "../application/logging";
import {ResponseError} from "../error/response-error";

class AuthUtil {
    static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }
}


export class SemesterController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const request: CreateSemesterRequest = req.body as CreateSemesterRequest;
            const response: SemesterResponse = await SemesterService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const kodeSemester: string = req.params.kodeSemester;
            const response: SemesterResponse = await SemesterService.get(kodeSemester);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const kodeSemester: string = req.params.kodeSemester;
            const request: UpdateSemesterRequest = req.body as UpdateSemesterRequest;
            const response: SemesterResponse = await SemesterService.update(kodeSemester, request);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const kodeSemester: string = req.params.kodeSemester;
            await SemesterService.remove(kodeSemester);

            logger.debug("Semester removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const request: SearchSemesterRequest = {
                semesterInt: req.query.semesterInt ? Number(req.query.semesterInt) : undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await SemesterService.search(request);

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