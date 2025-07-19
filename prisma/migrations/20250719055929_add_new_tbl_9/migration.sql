/*
  Warnings:

  - You are about to drop the `dosen` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mahasiswa` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `dosen` DROP FOREIGN KEY `dosen_userId_fkey`;

-- DropForeignKey
ALTER TABLE `mahasiswa` DROP FOREIGN KEY `mahasiswa_userId_fkey`;

-- AlterTable
ALTER TABLE `mata_kuliah` ADD COLUMN `KodeSemester_Fk` VARCHAR(191) NULL,
    ADD COLUMN `jenisMKId` VARCHAR(191) NULL,
    ADD COLUMN `kelompokMKId` VARCHAR(191) NULL,
    ADD COLUMN `lingkupKelasId` VARCHAR(191) NULL,
    ADD COLUMN `metodePembelajaranId` VARCHAR(191) NULL,
    ADD COLUMN `modeKuliahId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `dosen`;

-- DropTable
DROP TABLE `mahasiswa`;

-- CreateTable
CREATE TABLE `JenisMK` (
    `id_jenis_mk` VARCHAR(191) NOT NULL,
    `nama_jenis_mk` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `JenisMK_nama_jenis_mk_key`(`nama_jenis_mk`),
    PRIMARY KEY (`id_jenis_mk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KelompokMK` (
    `id_kelompok_mk` VARCHAR(191) NOT NULL,
    `nama_kelompok_mk` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `KelompokMK_nama_kelompok_mk_key`(`nama_kelompok_mk`),
    PRIMARY KEY (`id_kelompok_mk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LingkupKelas` (
    `id_lingkup_kelas` VARCHAR(191) NOT NULL,
    `nama_lingkup_kelas` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `LingkupKelas_nama_lingkup_kelas_key`(`nama_lingkup_kelas`),
    PRIMARY KEY (`id_lingkup_kelas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ModeKuliah` (
    `id_mode_kuliah` VARCHAR(191) NOT NULL,
    `nama_mode_kuliah` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `ModeKuliah_nama_mode_kuliah_key`(`nama_mode_kuliah`),
    PRIMARY KEY (`id_mode_kuliah`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MetodePembelajaran` (
    `id_metode_pembelajaran` VARCHAR(191) NOT NULL,
    `nama_metode_pembelajaran` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `MetodePembelajaran_nama_metode_pembelajaran_key`(`nama_metode_pembelajaran`),
    PRIMARY KEY (`id_metode_pembelajaran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Semester` (
    `KodeSemester` VARCHAR(191) NOT NULL,
    `Semester` INTEGER NOT NULL,

    PRIMARY KEY (`KodeSemester`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SKS_Mata_Kuliah` (
    `KodeSKS` VARCHAR(191) NOT NULL,
    `BobotTatapMuka` INTEGER NOT NULL,
    `BobotPraktikum` INTEGER NOT NULL,
    `BobotPraktekLapangan` INTEGER NOT NULL,
    `BobotSimulasi` INTEGER NOT NULL,
    `TotalBobot` INTEGER NOT NULL,
    `IDMK_Fk` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `SKS_Mata_Kuliah_IDMK_Fk_key`(`IDMK_Fk`),
    PRIMARY KEY (`KodeSKS`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mata_Kuliah` ADD CONSTRAINT `Mata_Kuliah_KodeSemester_Fk_fkey` FOREIGN KEY (`KodeSemester_Fk`) REFERENCES `Semester`(`KodeSemester`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mata_Kuliah` ADD CONSTRAINT `Mata_Kuliah_jenisMKId_fkey` FOREIGN KEY (`jenisMKId`) REFERENCES `JenisMK`(`id_jenis_mk`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mata_Kuliah` ADD CONSTRAINT `Mata_Kuliah_kelompokMKId_fkey` FOREIGN KEY (`kelompokMKId`) REFERENCES `KelompokMK`(`id_kelompok_mk`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mata_Kuliah` ADD CONSTRAINT `Mata_Kuliah_lingkupKelasId_fkey` FOREIGN KEY (`lingkupKelasId`) REFERENCES `LingkupKelas`(`id_lingkup_kelas`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mata_Kuliah` ADD CONSTRAINT `Mata_Kuliah_modeKuliahId_fkey` FOREIGN KEY (`modeKuliahId`) REFERENCES `ModeKuliah`(`id_mode_kuliah`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mata_Kuliah` ADD CONSTRAINT `Mata_Kuliah_metodePembelajaranId_fkey` FOREIGN KEY (`metodePembelajaranId`) REFERENCES `MetodePembelajaran`(`id_metode_pembelajaran`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SKS_Mata_Kuliah` ADD CONSTRAINT `SKS_Mata_Kuliah_IDMK_Fk_fkey` FOREIGN KEY (`IDMK_Fk`) REFERENCES `Mata_Kuliah`(`IDMK`) ON DELETE CASCADE ON UPDATE CASCADE;
