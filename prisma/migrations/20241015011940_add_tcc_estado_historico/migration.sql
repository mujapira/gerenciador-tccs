-- CreateTable
CREATE TABLE `TccEstadoHistorico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tccId` INTEGER NOT NULL,
    `statusId` INTEGER NOT NULL,
    `dataStatus` DATETIME(3) NOT NULL,
    `responsavelOrientadorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TccEstadoHistorico` ADD CONSTRAINT `TccEstadoHistorico_tccId_fkey` FOREIGN KEY (`tccId`) REFERENCES `Tcc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TccEstadoHistorico` ADD CONSTRAINT `TccEstadoHistorico_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `TccEstado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TccEstadoHistorico` ADD CONSTRAINT `TccEstadoHistorico_responsavelOrientadorId_fkey` FOREIGN KEY (`responsavelOrientadorId`) REFERENCES `Orientador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
