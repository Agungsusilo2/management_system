-- CreateTable
CREATE TABLE `mahasiswa` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `angkatan` INTEGER NOT NULL,
    `programStudiId` VARCHAR(191) NOT NULL,
    `tanggal_lahir` DATETIME(3) NULL,
    `gender` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `statusAkademik` VARCHAR(191) NULL,

    UNIQUE INDEX `mahasiswa_userId_key`(`userId`),
    UNIQUE INDEX `mahasiswa_nim_key`(`nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
