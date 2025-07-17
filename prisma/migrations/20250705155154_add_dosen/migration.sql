-- CreateTable
CREATE TABLE `dosen` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `nidn` VARCHAR(191) NOT NULL,
    `gelarAkademik` VARCHAR(191) NULL,
    `bidangKeahlian` VARCHAR(191) NULL,
    `programStudiId` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `statusKepegawaian` VARCHAR(191) NULL,

    UNIQUE INDEX `dosen_userId_key`(`userId`),
    UNIQUE INDEX `dosen_nidn_key`(`nidn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dosen` ADD CONSTRAINT `dosen_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
