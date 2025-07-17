-- CreateTable
CREATE TABLE `Aspek` (
    `KodeAspek` VARCHAR(50) NOT NULL,
    `Aspek` VARCHAR(255) NULL,

    PRIMARY KEY (`KodeAspek`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CPL_Prodi` (
    `KodeCPL` VARCHAR(50) NOT NULL,
    `Deskripsi_CPL` TEXT NULL,
    `KodeAspek` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`KodeCPL`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CPL_Prodi` ADD CONSTRAINT `CPL_Prodi_KodeAspek_fkey` FOREIGN KEY (`KodeAspek`) REFERENCES `Aspek`(`KodeAspek`) ON DELETE RESTRICT ON UPDATE CASCADE;
