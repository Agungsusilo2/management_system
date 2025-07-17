-- CreateTable
CREATE TABLE `Referensi` (
    `KodeReferensi` VARCHAR(50) NOT NULL,
    `Referensi` VARCHAR(255) NULL,

    PRIMARY KEY (`KodeReferensi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bahan_Kajian` (
    `KodeBK` VARCHAR(50) NOT NULL,
    `Bahan_Kajian` VARCHAR(255) NULL,
    `KodeReferensi` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`KodeBK`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bahan_Kajian` ADD CONSTRAINT `Bahan_Kajian_KodeReferensi_fkey` FOREIGN KEY (`KodeReferensi`) REFERENCES `Referensi`(`KodeReferensi`) ON DELETE RESTRICT ON UPDATE CASCADE;
