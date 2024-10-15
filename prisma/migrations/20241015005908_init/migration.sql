-- CreateTable
CREATE TABLE `Aluno` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `matricula` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `dataNasc` DATETIME(3) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NULL,
    `dataIngresso` DATETIME(3) NOT NULL,
    `semestreAtual` INTEGER NULL,
    `tccid` INTEGER NULL,

    UNIQUE INDEX `Aluno_email_key`(`email`),
    UNIQUE INDEX `Aluno_matricula_key`(`matricula`),
    UNIQUE INDEX `Aluno_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orientador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `departamento` VARCHAR(191) NOT NULL,
    `tituloAcademico` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Orientador_email_key`(`email`),
    UNIQUE INDEX `Orientador_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Turma` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tcc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `statusId` INTEGER NOT NULL,
    `orientadorId` INTEGER NULL,
    `turmaId` INTEGER NULL,
    `tccMetadataId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TccMetadata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `temaId` INTEGER NOT NULL,
    `classificacaoId` INTEGER NOT NULL,
    `orientadorId` INTEGER NOT NULL,
    `turmaId` INTEGER NOT NULL,
    `alunoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TccTema` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TccClassificacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TccPalavraChave` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `palavra` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TccPalavraChaveAssociacao` (
    `tccId` INTEGER NOT NULL,
    `palavraId` INTEGER NOT NULL,

    PRIMARY KEY (`tccId`, `palavraId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TccDocumento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeDocumento` VARCHAR(191) NOT NULL,
    `caminhoArquivo` VARCHAR(191) NOT NULL,
    `formatoDocumento` VARCHAR(191) NOT NULL,
    `dataEnvio` DATETIME(3) NOT NULL,
    `tamanhoArquivo` INTEGER NOT NULL,
    `tccId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TccBibliografia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referencia` VARCHAR(191) NOT NULL,
    `tccId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TccRelatorioProgresso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataEntrega` DATETIME(3) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `tccId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TccRelatorioProgressoArquivo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeArquivo` VARCHAR(191) NOT NULL,
    `caminhoArquivo` VARCHAR(191) NOT NULL,
    `formatoDocumento` VARCHAR(191) NOT NULL,
    `tamanhoArquivo` INTEGER NOT NULL,
    `relatorioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TccAvaliacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,
    `dataAvaliacao` DATETIME(3) NOT NULL,
    `nota` DOUBLE NOT NULL,
    `orientadorId` INTEGER NOT NULL,
    `tccId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TccEstado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AlunoTurma` (
    `alunoId` INTEGER NOT NULL,
    `turmaId` INTEGER NOT NULL,

    PRIMARY KEY (`alunoId`, `turmaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comunidade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `criadorAlunoId` INTEGER NULL,
    `criadorOrientadorId` INTEGER NULL,
    `dataCriacao` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ComunidadeSeguidor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comunidadeId` INTEGER NOT NULL,
    `seguidorAlunoId` INTEGER NULL,
    `seguidorOrientadorId` INTEGER NULL,
    `dataSeguimento` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ComunidadePost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comunidadeId` INTEGER NOT NULL,
    `autorAlunoId` INTEGER NULL,
    `autorOrientadorId` INTEGER NULL,
    `conteudo` VARCHAR(191) NOT NULL,
    `dataPostagem` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Aluno` ADD CONSTRAINT `Aluno_tccid_fkey` FOREIGN KEY (`tccid`) REFERENCES `Tcc`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tcc` ADD CONSTRAINT `Tcc_tccMetadataId_fkey` FOREIGN KEY (`tccMetadataId`) REFERENCES `TccMetadata`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tcc` ADD CONSTRAINT `Tcc_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `TccEstado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tcc` ADD CONSTRAINT `Tcc_orientadorId_fkey` FOREIGN KEY (`orientadorId`) REFERENCES `Orientador`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tcc` ADD CONSTRAINT `Tcc_turmaId_fkey` FOREIGN KEY (`turmaId`) REFERENCES `Turma`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TccMetadata` ADD CONSTRAINT `TccMetadata_temaId_fkey` FOREIGN KEY (`temaId`) REFERENCES `TccTema`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TccMetadata` ADD CONSTRAINT `TccMetadata_classificacaoId_fkey` FOREIGN KEY (`classificacaoId`) REFERENCES `TccClassificacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TccMetadata` ADD CONSTRAINT `TccMetadata_orientadorId_fkey` FOREIGN KEY (`orientadorId`) REFERENCES `Orientador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TccMetadata` ADD CONSTRAINT `TccMetadata_turmaId_fkey` FOREIGN KEY (`turmaId`) REFERENCES `Turma`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TccMetadata` ADD CONSTRAINT `TccMetadata_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Aluno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TccPalavraChaveAssociacao` ADD CONSTRAINT `TccPalavraChaveAssociacao_tccId_fkey` FOREIGN KEY (`tccId`) REFERENCES `Tcc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TccPalavraChaveAssociacao` ADD CONSTRAINT `TccPalavraChaveAssociacao_palavraId_fkey` FOREIGN KEY (`palavraId`) REFERENCES `TccPalavraChave`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TccDocumento` ADD CONSTRAINT `TccDocumento_tccId_fkey` FOREIGN KEY (`tccId`) REFERENCES `Tcc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TccBibliografia` ADD CONSTRAINT `TccBibliografia_tccId_fkey` FOREIGN KEY (`tccId`) REFERENCES `Tcc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TccRelatorioProgresso` ADD CONSTRAINT `TccRelatorioProgresso_tccId_fkey` FOREIGN KEY (`tccId`) REFERENCES `Tcc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TccRelatorioProgressoArquivo` ADD CONSTRAINT `TccRelatorioProgressoArquivo_relatorioId_fkey` FOREIGN KEY (`relatorioId`) REFERENCES `TccRelatorioProgresso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TccAvaliacao` ADD CONSTRAINT `TccAvaliacao_orientadorId_fkey` FOREIGN KEY (`orientadorId`) REFERENCES `Orientador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TccAvaliacao` ADD CONSTRAINT `TccAvaliacao_tccId_fkey` FOREIGN KEY (`tccId`) REFERENCES `Tcc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AlunoTurma` ADD CONSTRAINT `AlunoTurma_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Aluno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AlunoTurma` ADD CONSTRAINT `AlunoTurma_turmaId_fkey` FOREIGN KEY (`turmaId`) REFERENCES `Turma`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comunidade` ADD CONSTRAINT `Comunidade_criadorAlunoId_fkey` FOREIGN KEY (`criadorAlunoId`) REFERENCES `Aluno`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comunidade` ADD CONSTRAINT `Comunidade_criadorOrientadorId_fkey` FOREIGN KEY (`criadorOrientadorId`) REFERENCES `Orientador`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComunidadeSeguidor` ADD CONSTRAINT `ComunidadeSeguidor_seguidorAlunoId_fkey` FOREIGN KEY (`seguidorAlunoId`) REFERENCES `Aluno`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComunidadeSeguidor` ADD CONSTRAINT `ComunidadeSeguidor_seguidorOrientadorId_fkey` FOREIGN KEY (`seguidorOrientadorId`) REFERENCES `Orientador`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComunidadeSeguidor` ADD CONSTRAINT `ComunidadeSeguidor_comunidadeId_fkey` FOREIGN KEY (`comunidadeId`) REFERENCES `Comunidade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComunidadePost` ADD CONSTRAINT `ComunidadePost_autorAlunoId_fkey` FOREIGN KEY (`autorAlunoId`) REFERENCES `Aluno`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComunidadePost` ADD CONSTRAINT `ComunidadePost_autorOrientadorId_fkey` FOREIGN KEY (`autorOrientadorId`) REFERENCES `Orientador`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComunidadePost` ADD CONSTRAINT `ComunidadePost_comunidadeId_fkey` FOREIGN KEY (`comunidadeId`) REFERENCES `Comunidade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
