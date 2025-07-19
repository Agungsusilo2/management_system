import {SKSMataKuliah} from "../../generated/prisma";

export type SKSMataKuliahResponse = {
    kodeSKS: string;
    bobotTatapMuka: number;
    bobotPraktikum: number;
    bobotPraktekLapangan: number;
    bobotSimulasi: number;
    totalBobot: number;
    idmk: string; // Foreign key
};

export type CreateSKSMataKuliahRequest = {
    bobotTatapMuka: number;
    bobotPraktikum: number;
    bobotPraktekLapangan: number;
    bobotSimulasi: number;
    idmk: string; // Foreign key
};

export type UpdateSKSMataKuliahRequest = {
    bobotTatapMuka?: number;
    bobotPraktikum?: number;
    bobotPraktekLapangan?: number;
    bobotSimulasi?: number;
    idmk?: string; // Foreign key
};

export type SearchSKSMataKuliahRequest = {
    idmk?: string;
    page?: number;
    size?: number;
}

export function toSKSMataKuliahResponse(sksMataKuliah: SKSMataKuliah): SKSMataKuliahResponse {
    return {
        kodeSKS: sksMataKuliah.KodeSKS,
        bobotTatapMuka: sksMataKuliah.BobotTatapMuka,
        bobotPraktikum: sksMataKuliah.BobotPraktikum,
        bobotPraktekLapangan: sksMataKuliah.BobotPraktekLapangan,
        bobotSimulasi: sksMataKuliah.BobotSimulasi,
        totalBobot: sksMataKuliah.TotalBobot,
        idmk: sksMataKuliah.IDMK,
    };
}