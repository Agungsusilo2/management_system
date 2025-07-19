import {Semester} from "../../generated/prisma";

export type SemesterResponse = {
    kodeSemester: string;
    semesterInt: number;
};

export type CreateSemesterRequest = {
    semesterInt: number;
};

export type UpdateSemesterRequest = {
    semesterInt?: number;
};

export type SearchSemesterRequest = {
    semesterInt?: number;
    page?: number;
    size?: number;
}

export function toSemesterResponse(semester: Semester): SemesterResponse {
    return {
        kodeSemester: semester.KodeSemester,
        semesterInt: semester.SemesterInt,
    };
}