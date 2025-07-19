"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSKSMataKuliahResponse = toSKSMataKuliahResponse;
function toSKSMataKuliahResponse(sksMataKuliah) {
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
