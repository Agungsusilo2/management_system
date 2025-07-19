"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMataKuliahResponse = toMataKuliahResponse;
function toMataKuliahResponse(mataKuliah) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        idmk: mataKuliah.IDMK,
        namaMk: mataKuliah.NamaMK,
        kodeSemester: mataKuliah.KodeSemester,
        jenisMKId: mataKuliah.jenisMKId,
        kelompokMKId: mataKuliah.kelompokMKId,
        lingkupKelasId: mataKuliah.lingkupKelasId,
        modeKuliahId: mataKuliah.modeKuliahId,
        metodePembelajaranId: mataKuliah.metodePembelajaranId,
        semesterInt: (_a = mataKuliah.semester) === null || _a === void 0 ? void 0 : _a.SemesterInt,
        sksMataKuliahKodeSKS: (_b = mataKuliah.sksMataKuliah) === null || _b === void 0 ? void 0 : _b.KodeSKS,
        sksTotalBobot: (_c = mataKuliah.sksMataKuliah) === null || _c === void 0 ? void 0 : _c.TotalBobot,
        jenisMkNama: (_d = mataKuliah.jenis_mk) === null || _d === void 0 ? void 0 : _d.nama_jenis_mk,
        kelompokMkNama: (_e = mataKuliah.kelompok_mk) === null || _e === void 0 ? void 0 : _e.nama_kelompok_mk,
        lingkupKelasNama: (_f = mataKuliah.lingkup_kelas) === null || _f === void 0 ? void 0 : _f.nama_lingkup_kelas,
        modeKuliahNama: (_g = mataKuliah.mode_kuliah) === null || _g === void 0 ? void 0 : _g.nama_mode_kuliah,
        metodePembelajaranNama: (_h = mataKuliah.metode_pembelajaran) === null || _h === void 0 ? void 0 : _h.nama_metode_pembelajaran,
    };
}
