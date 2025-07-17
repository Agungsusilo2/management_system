-- CreateTable
CREATE TABLE `Profesi` (
    `KodeProfesi` VARCHAR(50) NOT NULL,
    `Profesi` VARCHAR(255) NULL,

    PRIMARY KEY (`KodeProfesi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfilLulusan` (
    `KodePL` VARCHAR(50) NOT NULL,
    `ProfilLulusan` VARCHAR(255) NULL,
    `KodeProfesi` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`KodePL`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProfilLulusan` ADD CONSTRAINT `ProfilLulusan_KodeProfesi_fkey` FOREIGN KEY (`KodeProfesi`) REFERENCES `Profesi`(`KodeProfesi`) ON DELETE RESTRICT ON UPDATE CASCADE;
