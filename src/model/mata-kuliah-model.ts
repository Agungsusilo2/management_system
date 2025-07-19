import {
    MataKuliah,
    Semester,
    SKSMataKuliah,
    JenisMK,
    KelompokMK,
    LingkupKelas,
    ModeKuliah,
    MetodePembelajaran
} from '../../generated/prisma';

export type MataKuliahResponse = {
    idmk: string;
    namaMk?: string | null;
    kodeSemester?: string | null;
    jenisMKId?: string | null;
    kelompokMKId?: string | null;
    lingkupKelasId?: string | null;
    modeKuliahId?: string | null;
    metodePembelajaranId?: string | null;

    // --- ADD THESE MISSING PROPERTIES ---
    semesterInt?: number | null; // Added
    sksMataKuliahKodeSKS?: string | null; // Added
    sksTotalBobot?: number | null; // Added
    jenisMkNama?: string | null; // Added
    kelompokMkNama?: string | null; // Added
    lingkupKelasNama?: string | null; // Added
    modeKuliahNama?: string | null; // Added
    metodePembelajaranNama?: string | null; // Added
    // --- END ADDITIONS ---
};

export type CreateMataKuliahRequest = {
    idmk: string;
    namaMk: string;
    kodeSemester?: string;
    jenisMKId?: string;
    kelompokMKId?: string;
    lingkupKelasId?: string;
    modeKuliahId?: string;
    metodePembelajaranId?: string;
};

export type UpdateMataKuliahRequest = {
    namaMk?: string;
    kodeSemester?: string | null; // Allow null to disconnect
    jenisMKId?: string | null;
    kelompokMKId?: string | null;
    lingkupKelasId?: string | null;
    modeKuliahId?: string | null;
    metodePembelajaranId?: string | null;
};

export type SearchMataKuliahRequest = {
    idmk?: string;
    namaMk?: string;
    kodeSemester?: string;
    jenisMKId?: string;
    kelompokMKId?: string;
    lingkupKelasId?: string;
    modeKuliahId?: string;
    metodePembelajaranId?: string;
    page?: number;
    size?: number;
};

export function toMataKuliahResponse(
    mataKuliah: MataKuliah & {
        semester?: Semester | null;
        sksMataKuliah?: SKSMataKuliah | null;
        jenis_mk?: JenisMK | null;
        kelompok_mk?: KelompokMK | null;
        lingkup_kelas?: LingkupKelas | null;
        mode_kuliah?: ModeKuliah | null;
        metode_pembelajaran?: MetodePembelajaran | null;
    }
): MataKuliahResponse {
    return {
        idmk: mataKuliah.IDMK,
        namaMk: mataKuliah.NamaMK,
        kodeSemester: mataKuliah.KodeSemester,
        jenisMKId: mataKuliah.jenisMKId,
        kelompokMKId: mataKuliah.kelompokMKId,
        lingkupKelasId: mataKuliah.lingkupKelasId,
        modeKuliahId: mataKuliah.modeKuliahId,
        metodePembelajaranId: mataKuliah.metodePembelajaranId,
        semesterInt: mataKuliah.semester?.SemesterInt,
        sksMataKuliahKodeSKS: mataKuliah.sksMataKuliah?.KodeSKS,
        sksTotalBobot: mataKuliah.sksMataKuliah?.TotalBobot,
        jenisMkNama: mataKuliah.jenis_mk?.nama_jenis_mk,
        kelompokMkNama: mataKuliah.kelompok_mk?.nama_kelompok_mk,
        lingkupKelasNama: mataKuliah.lingkup_kelas?.nama_lingkup_kelas,
        modeKuliahNama: mataKuliah.mode_kuliah?.nama_mode_kuliah,
        metodePembelajaranNama: mataKuliah.metode_pembelajaran?.nama_metode_pembelajaran,
    };
}