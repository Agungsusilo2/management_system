"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSemesterResponse = toSemesterResponse;
function toSemesterResponse(semester) {
    return {
        kodeSemester: semester.KodeSemester,
        semesterInt: semester.SemesterInt,
    };
}
