-- CreateTable
CREATE TABLE `TccTipoDocumento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TccDocumentoToTccTipoDocumento` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TccDocumentoToTccTipoDocumento_AB_unique`(`A`, `B`),
    INDEX `_TccDocumentoToTccTipoDocumento_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_TccDocumentoToTccTipoDocumento` ADD CONSTRAINT `_TccDocumentoToTccTipoDocumento_A_fkey` FOREIGN KEY (`A`) REFERENCES `TccDocumento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TccDocumentoToTccTipoDocumento` ADD CONSTRAINT `_TccDocumentoToTccTipoDocumento_B_fkey` FOREIGN KEY (`B`) REFERENCES `TccTipoDocumento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
