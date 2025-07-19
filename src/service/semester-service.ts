import {
    CreateSemesterRequest, SearchSemesterRequest,
    SemesterResponse,
    toSemesterResponse,
    UpdateSemesterRequest
} from "../model/semester-model";
import {Validation} from "../validation/validation";
import {SemesterValidation} from "../validation/semester-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";

export class SemesterService {
    static async create(request: CreateSemesterRequest): Promise<SemesterResponse> {
        const createRequest = Validation.validate(SemesterValidation.CREATE, request);

        const existingSemester = await prismaClient.semester.count({
            where: {
                SemesterInt: createRequest.semesterInt,
            }
        });
        if (existingSemester > 0) {
            throw new ResponseError(400, "Semester with this number already exists.");
        }

        const newSemester = await prismaClient.semester.create({
            data: {
                SemesterInt: createRequest.semesterInt,
            },
        });

        return toSemesterResponse(newSemester);
    }

    static async get(kodeSemester: string): Promise<SemesterResponse> {
        kodeSemester = Validation.validate(SemesterValidation.KODE_SEMESTER, kodeSemester);

        const semester = await prismaClient.semester.findUnique({
            where: { KodeSemester: kodeSemester },
        });

        if (!semester) {
            throw new ResponseError(404, "Semester not found");
        }

        return toSemesterResponse(semester);
    }

    static async update(kodeSemester: string, request: UpdateSemesterRequest): Promise<SemesterResponse> {
        kodeSemester = Validation.validate(SemesterValidation.KODE_SEMESTER, kodeSemester);
        const updateRequest = Validation.validate(SemesterValidation.UPDATE, request);

        const existingSemester = await prismaClient.semester.findUnique({
            where: { KodeSemester: kodeSemester }
        });

        if (!existingSemester) {
            throw new ResponseError(404, "Semester not found");
        }

        const updatedSemester = await prismaClient.semester.update({
            where: { KodeSemester: kodeSemester },
            data: {
                SemesterInt: updateRequest.semesterInt ?? existingSemester.SemesterInt,
            }
        });

        return toSemesterResponse(updatedSemester);
    }

    static async remove(kodeSemester: string): Promise<void> {
        kodeSemester = Validation.validate(SemesterValidation.KODE_SEMESTER, kodeSemester);

        const existingSemesterCount = await prismaClient.semester.count({
            where: { KodeSemester: kodeSemester }
        });

        if (existingSemesterCount === 0) {
            throw new ResponseError(404, "Semester not found");
        }

        const mataKuliahCount = await prismaClient.mataKuliah.count({
            where: { KodeSemester: kodeSemester }
        });
        if (mataKuliahCount > 0) {
            throw new ResponseError(400, "Cannot delete Semester: still referenced by Mata Kuliah");
        }

        await prismaClient.semester.delete({
            where: { KodeSemester: kodeSemester }
        });
    }

    static async search(request: SearchSemesterRequest): Promise<[SemesterResponse[], number]> {
        const searchRequest = Validation.validate(SemesterValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters: any[] = [];

        if (searchRequest.semesterInt) {
            filters.push({
                SemesterInt: searchRequest.semesterInt
            });
        }

        const [semesters, total] = await prismaClient.$transaction([
            prismaClient.semester.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                orderBy: { SemesterInt: 'asc' }
            }),
            prismaClient.semester.count({ where: { AND: filters } })
        ]);

        const responses = semesters.map(toSemesterResponse);

        return [responses, total];
    }
}