import {Request, Response, NextFunction} from "express";
import {ZodError} from "zod";
import {ResponseError} from "../error/response-error";
import {Prisma} from "../../generated/prisma";
export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof ZodError) {
         res.status(400).json({
            errors: `Validation Error : ${JSON.stringify(err)}`
        });
    } else if (err instanceof ResponseError) {
         res.status(err.status).json({
            errors: err.message
        });
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
             res.status(400).json({
                errors: "Email already exists"
            });
        }
    } else {
         res.status(500).json({
            errors: err.message
        });
    }
};
