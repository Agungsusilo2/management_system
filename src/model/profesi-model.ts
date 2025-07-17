// src/model/profesi-model.ts


import {Profesi} from "../../generated/prisma";

export type ProfesiResponse = {
    kodeProfesi: string;
    namaProfesi?: string | null;
};

export type UpdateProfesiRequest = {
    namaProfesi?: string;
};

export function toProfesiResponse(profesi: Profesi): ProfesiResponse {
    return {
        kodeProfesi: profesi.KodeProfesi,
        namaProfesi: profesi.Profesi,
    };
}
