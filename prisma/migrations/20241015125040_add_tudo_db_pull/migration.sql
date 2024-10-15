/*
  Warnings:

  - You are about to drop the column `dataIngresso` on the `aluno` table. All the data in the column will be lost.
  - You are about to drop the column `dataNasc` on the `aluno` table. All the data in the column will be lost.
  - You are about to drop the column `semestreAtual` on the `aluno` table. All the data in the column will be lost.
  - You are about to drop the column `tccid` on the `aluno` table. All the data in the column will be lost.
  - You are about to alter the column `nome` on the `aluno` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `email` on the `aluno` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `matricula` on the `aluno` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `cpf` on the `aluno` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(11)`.
  - You are about to alter the column `telefone` on the `aluno` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `cidade` on the `aluno` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `estado` on the `aluno` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to drop the column `criadorAlunoId` on the `comunidade` table. All the data in the column will be lost.
  - You are about to drop the column `criadorOrientadorId` on the `comunidade` table. All the data in the column will be lost.
  - You are about to drop the column `dataCriacao` on the `comunidade` table. All the data in the column will be lost.
  - You are about to drop the column `tituloAcademico` on the `orientador` table. All the data in the column will be lost.
  - You are about to alter the column `nome` on the `orientador` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `email` on the `orientador` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `cpf` on the `orientador` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(11)`.
  - You are about to alter the column `telefone` on the `orientador` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `departamento` on the `orientador` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the column `orientadorId` on the `tcc` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `tcc` table. All the data in the column will be lost.
  - You are about to drop the column `tccMetadataId` on the `tcc` table. All the data in the column will be lost.
  - You are about to drop the column `turmaId` on the `tcc` table. All the data in the column will be lost.
  - You are about to alter the column `nome` on the `turma` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the `_tccdocumentototcctipodocumento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `alunoturma` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comunidadepost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comunidadeseguidor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tccavaliacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tccbibliografia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tccclassificacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tccdocumento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tccestado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tccestadohistorico` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tccmetadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tccpalavrachave` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tccpalavrachaveassociacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tccrelatorioprogresso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tccrelatorioprogressoarquivo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tcctema` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tcctipodocumento` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `data_ingresso` to the `aluno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_nascimento` to the `aluno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_criacao` to the `comunidade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo_academico` to the `orientador` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_tccdocumentototcctipodocumento` DROP FOREIGN KEY `_TccDocumentoToTccTipoDocumento_A_fkey`;

-- DropForeignKey
ALTER TABLE `_tccdocumentototcctipodocumento` DROP FOREIGN KEY `_TccDocumentoToTccTipoDocumento_B_fkey`;

-- DropForeignKey
ALTER TABLE `aluno` DROP FOREIGN KEY `Aluno_tccid_fkey`;

-- DropForeignKey
ALTER TABLE `alunoturma` DROP FOREIGN KEY `AlunoTurma_alunoId_fkey`;

-- DropForeignKey
ALTER TABLE `alunoturma` DROP FOREIGN KEY `AlunoTurma_turmaId_fkey`;

-- DropForeignKey
ALTER TABLE `comunidade` DROP FOREIGN KEY `Comunidade_criadorAlunoId_fkey`;

-- DropForeignKey
ALTER TABLE `comunidade` DROP FOREIGN KEY `Comunidade_criadorOrientadorId_fkey`;

-- DropForeignKey
ALTER TABLE `comunidadepost` DROP FOREIGN KEY `ComunidadePost_autorAlunoId_fkey`;

-- DropForeignKey
ALTER TABLE `comunidadepost` DROP FOREIGN KEY `ComunidadePost_autorOrientadorId_fkey`;

-- DropForeignKey
ALTER TABLE `comunidadepost` DROP FOREIGN KEY `ComunidadePost_comunidadeId_fkey`;

-- DropForeignKey
ALTER TABLE `comunidadeseguidor` DROP FOREIGN KEY `ComunidadeSeguidor_comunidadeId_fkey`;

-- DropForeignKey
ALTER TABLE `comunidadeseguidor` DROP FOREIGN KEY `ComunidadeSeguidor_seguidorAlunoId_fkey`;

-- DropForeignKey
ALTER TABLE `comunidadeseguidor` DROP FOREIGN KEY `ComunidadeSeguidor_seguidorOrientadorId_fkey`;

-- DropForeignKey
ALTER TABLE `tcc` DROP FOREIGN KEY `Tcc_orientadorId_fkey`;

-- DropForeignKey
ALTER TABLE `tcc` DROP FOREIGN KEY `Tcc_statusId_fkey`;

-- DropForeignKey
ALTER TABLE `tcc` DROP FOREIGN KEY `Tcc_tccMetadataId_fkey`;

-- DropForeignKey
ALTER TABLE `tcc` DROP FOREIGN KEY `Tcc_turmaId_fkey`;

-- DropForeignKey
ALTER TABLE `tccavaliacao` DROP FOREIGN KEY `TccAvaliacao_orientadorId_fkey`;

-- DropForeignKey
ALTER TABLE `tccavaliacao` DROP FOREIGN KEY `TccAvaliacao_tccId_fkey`;

-- DropForeignKey
ALTER TABLE `tccbibliografia` DROP FOREIGN KEY `TccBibliografia_tccId_fkey`;

-- DropForeignKey
ALTER TABLE `tccdocumento` DROP FOREIGN KEY `TccDocumento_tccId_fkey`;

-- DropForeignKey
ALTER TABLE `tccestadohistorico` DROP FOREIGN KEY `TccEstadoHistorico_responsavelOrientadorId_fkey`;

-- DropForeignKey
ALTER TABLE `tccestadohistorico` DROP FOREIGN KEY `TccEstadoHistorico_statusId_fkey`;

-- DropForeignKey
ALTER TABLE `tccestadohistorico` DROP FOREIGN KEY `TccEstadoHistorico_tccId_fkey`;

-- DropForeignKey
ALTER TABLE `tccmetadata` DROP FOREIGN KEY `TccMetadata_alunoId_fkey`;

-- DropForeignKey
ALTER TABLE `tccmetadata` DROP FOREIGN KEY `TccMetadata_classificacaoId_fkey`;

-- DropForeignKey
ALTER TABLE `tccmetadata` DROP FOREIGN KEY `TccMetadata_orientadorId_fkey`;

-- DropForeignKey
ALTER TABLE `tccmetadata` DROP FOREIGN KEY `TccMetadata_temaId_fkey`;

-- DropForeignKey
ALTER TABLE `tccmetadata` DROP FOREIGN KEY `TccMetadata_turmaId_fkey`;

-- DropForeignKey
ALTER TABLE `tccpalavrachaveassociacao` DROP FOREIGN KEY `TccPalavraChaveAssociacao_palavraId_fkey`;

-- DropForeignKey
ALTER TABLE `tccpalavrachaveassociacao` DROP FOREIGN KEY `TccPalavraChaveAssociacao_tccId_fkey`;

-- DropForeignKey
ALTER TABLE `tccrelatorioprogresso` DROP FOREIGN KEY `TccRelatorioProgresso_tccId_fkey`;

-- DropForeignKey
ALTER TABLE `tccrelatorioprogressoarquivo` DROP FOREIGN KEY `TccRelatorioProgressoArquivo_relatorioId_fkey`;

-- AlterTable
ALTER TABLE `aluno` DROP COLUMN `dataIngresso`,
    DROP COLUMN `dataNasc`,
    DROP COLUMN `semestreAtual`,
    DROP COLUMN `tccid`,
    ADD COLUMN `data_ingresso` DATE NOT NULL,
    ADD COLUMN `data_nascimento` DATE NOT NULL,
    ADD COLUMN `semestre_atual` INTEGER NULL,
    MODIFY `nome` VARCHAR(100) NOT NULL,
    MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `matricula` VARCHAR(20) NOT NULL,
    MODIFY `cpf` VARCHAR(11) NOT NULL,
    MODIFY `telefone` VARCHAR(20) NULL,
    MODIFY `endereco` VARCHAR(255) NULL,
    MODIFY `cidade` VARCHAR(100) NULL,
    MODIFY `estado` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `comunidade` DROP COLUMN `criadorAlunoId`,
    DROP COLUMN `criadorOrientadorId`,
    DROP COLUMN `dataCriacao`,
    ADD COLUMN `criador_aluno_id` INTEGER NULL,
    ADD COLUMN `criador_orientador_id` INTEGER NULL,
    ADD COLUMN `data_criacao` DATE NOT NULL,
    MODIFY `nome` VARCHAR(255) NOT NULL,
    MODIFY `descricao` TEXT NULL;

-- AlterTable
ALTER TABLE `orientador` DROP COLUMN `tituloAcademico`,
    ADD COLUMN `titulo_academico` VARCHAR(50) NOT NULL,
    MODIFY `nome` VARCHAR(100) NOT NULL,
    MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `cpf` VARCHAR(11) NOT NULL,
    MODIFY `telefone` VARCHAR(20) NULL,
    MODIFY `departamento` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `tcc` DROP COLUMN `orientadorId`,
    DROP COLUMN `statusId`,
    DROP COLUMN `tccMetadataId`,
    DROP COLUMN `turmaId`,
    ADD COLUMN `metadata_id` INTEGER NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1,
    MODIFY `titulo` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `turma` MODIFY `nome` VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE `_tccdocumentototcctipodocumento`;

-- DropTable
DROP TABLE `alunoturma`;

-- DropTable
DROP TABLE `comunidadepost`;

-- DropTable
DROP TABLE `comunidadeseguidor`;

-- DropTable
DROP TABLE `tccavaliacao`;

-- DropTable
DROP TABLE `tccbibliografia`;

-- DropTable
DROP TABLE `tccclassificacao`;

-- DropTable
DROP TABLE `tccdocumento`;

-- DropTable
DROP TABLE `tccestado`;

-- DropTable
DROP TABLE `tccestadohistorico`;

-- DropTable
DROP TABLE `tccmetadata`;

-- DropTable
DROP TABLE `tccpalavrachave`;

-- DropTable
DROP TABLE `tccpalavrachaveassociacao`;

-- DropTable
DROP TABLE `tccrelatorioprogresso`;

-- DropTable
DROP TABLE `tccrelatorioprogressoarquivo`;

-- DropTable
DROP TABLE `tcctema`;

-- DropTable
DROP TABLE `tcctipodocumento`;

-- CreateTable
CREATE TABLE `aluno_turma` (
    `aluno_id` INTEGER NOT NULL,
    `turma_id` INTEGER NOT NULL,

    INDEX `turma_id`(`turma_id`),
    PRIMARY KEY (`aluno_id`, `turma_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comunidade_post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comunidade_id` INTEGER NULL,
    `autor_aluno_id` INTEGER NULL,
    `autor_orientador_id` INTEGER NULL,
    `conteudo` TEXT NOT NULL,
    `data_postagem` DATE NOT NULL,

    INDEX `autor_aluno_id`(`autor_aluno_id`),
    INDEX `autor_orientador_id`(`autor_orientador_id`),
    INDEX `comunidade_id`(`comunidade_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comunidade_seguidor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comunidade_id` INTEGER NULL,
    `seguidor_aluno_id` INTEGER NULL,
    `seguidor_orientador_id` INTEGER NULL,
    `data_seguimento` DATE NOT NULL,

    INDEX `comunidade_id`(`comunidade_id`),
    INDEX `seguidor_aluno_id`(`seguidor_aluno_id`),
    INDEX `seguidor_orientador_id`(`seguidor_orientador_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tcc_avaliacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tcc_id` INTEGER NULL,
    `orientador_id` INTEGER NULL,
    `data_avaliacao` DATE NOT NULL,
    `descricao` TEXT NOT NULL,
    `nota` DECIMAL(5, 2) NULL,

    INDEX `orientador_id`(`orientador_id`),
    INDEX `tcc_id`(`tcc_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tcc_bibliografia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tcc_id` INTEGER NULL,
    `referencia` VARCHAR(500) NOT NULL,

    INDEX `tcc_id`(`tcc_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tcc_classificacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tcc_documento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tcc_id` INTEGER NULL,
    `tipo_documento_id` INTEGER NOT NULL,
    `nome_documento` VARCHAR(255) NOT NULL,
    `caminho_arquivo` VARCHAR(500) NOT NULL,
    `formato_documento` VARCHAR(10) NOT NULL,
    `data_envio` DATE NOT NULL,
    `tamanho_arquivo` INTEGER NULL,

    INDEX `tcc_id`(`tcc_id`),
    INDEX `tipo_documento_id`(`tipo_documento_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tcc_estado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tcc_estado_historico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tcc_id` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `data_status` DATE NOT NULL,
    `responsavel_orientador_id` INTEGER NULL,

    INDEX `responsavel_orientador_id`(`responsavel_orientador_id`),
    INDEX `status`(`status`),
    INDEX `tcc_id`(`tcc_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tcc_metadata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tema_id` INTEGER NOT NULL,
    `classificacao_id` INTEGER NOT NULL,
    `orientador_id` INTEGER NOT NULL,
    `turma_id` INTEGER NOT NULL,
    `aluno_id` INTEGER NOT NULL,

    INDEX `aluno_id`(`aluno_id`),
    INDEX `classificacao_id`(`classificacao_id`),
    INDEX `orientador_id`(`orientador_id`),
    INDEX `tema_id`(`tema_id`),
    INDEX `turma_id`(`turma_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tcc_nota_final` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tcc_id` INTEGER NOT NULL,
    `nota_final` DECIMAL(5, 2) NOT NULL,
    `data_calculo` DATE NOT NULL DEFAULT (curdate()),

    INDEX `tcc_id`(`tcc_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tcc_palavra_chave` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `palavra` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tcc_palavra_chave_associacao` (
    `tcc_id` INTEGER NOT NULL,
    `palavra_id` INTEGER NOT NULL,

    INDEX `palavra_id`(`palavra_id`),
    PRIMARY KEY (`tcc_id`, `palavra_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tcc_relatorio_progresso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tcc_id` INTEGER NULL,
    `data_entrega` DATE NOT NULL,
    `descricao` TEXT NOT NULL,

    INDEX `tcc_id`(`tcc_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tcc_relatorio_progresso_arquivo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `relatorio_id` INTEGER NULL,
    `nome_arquivo` VARCHAR(255) NOT NULL,
    `caminho_arquivo` VARCHAR(500) NOT NULL,
    `formato_documento` VARCHAR(10) NOT NULL,
    `tamanho_arquivo` INTEGER NULL,

    INDEX `relatorio_id`(`relatorio_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tcc_tema` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tcc_tipo_documento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `criador_aluno_id` ON `comunidade`(`criador_aluno_id`);

-- CreateIndex
CREATE INDEX `criador_orientador_id` ON `comunidade`(`criador_orientador_id`);

-- CreateIndex
CREATE INDEX `metadata_id` ON `tcc`(`metadata_id`);

-- CreateIndex
CREATE INDEX `status` ON `tcc`(`status`);

-- AddForeignKey
ALTER TABLE `aluno_turma` ADD CONSTRAINT `aluno_turma_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `aluno`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `aluno_turma` ADD CONSTRAINT `aluno_turma_ibfk_2` FOREIGN KEY (`turma_id`) REFERENCES `turma`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comunidade` ADD CONSTRAINT `comunidade_ibfk_1` FOREIGN KEY (`criador_aluno_id`) REFERENCES `aluno`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comunidade` ADD CONSTRAINT `comunidade_ibfk_2` FOREIGN KEY (`criador_orientador_id`) REFERENCES `orientador`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comunidade_post` ADD CONSTRAINT `comunidade_post_ibfk_1` FOREIGN KEY (`comunidade_id`) REFERENCES `comunidade`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comunidade_post` ADD CONSTRAINT `comunidade_post_ibfk_2` FOREIGN KEY (`autor_aluno_id`) REFERENCES `aluno`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comunidade_post` ADD CONSTRAINT `comunidade_post_ibfk_3` FOREIGN KEY (`autor_orientador_id`) REFERENCES `orientador`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comunidade_seguidor` ADD CONSTRAINT `comunidade_seguidor_ibfk_1` FOREIGN KEY (`comunidade_id`) REFERENCES `comunidade`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comunidade_seguidor` ADD CONSTRAINT `comunidade_seguidor_ibfk_2` FOREIGN KEY (`seguidor_aluno_id`) REFERENCES `aluno`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comunidade_seguidor` ADD CONSTRAINT `comunidade_seguidor_ibfk_3` FOREIGN KEY (`seguidor_orientador_id`) REFERENCES `orientador`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc` ADD CONSTRAINT `tcc_ibfk_1` FOREIGN KEY (`metadata_id`) REFERENCES `tcc_metadata`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc` ADD CONSTRAINT `tcc_ibfk_2` FOREIGN KEY (`status`) REFERENCES `tcc_estado`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_avaliacao` ADD CONSTRAINT `tcc_avaliacao_ibfk_1` FOREIGN KEY (`tcc_id`) REFERENCES `tcc`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_avaliacao` ADD CONSTRAINT `tcc_avaliacao_ibfk_2` FOREIGN KEY (`orientador_id`) REFERENCES `orientador`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_bibliografia` ADD CONSTRAINT `tcc_bibliografia_ibfk_1` FOREIGN KEY (`tcc_id`) REFERENCES `tcc`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_documento` ADD CONSTRAINT `tcc_documento_ibfk_1` FOREIGN KEY (`tcc_id`) REFERENCES `tcc`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_documento` ADD CONSTRAINT `tcc_documento_ibfk_2` FOREIGN KEY (`tipo_documento_id`) REFERENCES `tcc_tipo_documento`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_estado_historico` ADD CONSTRAINT `tcc_estado_historico_ibfk_1` FOREIGN KEY (`tcc_id`) REFERENCES `tcc`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_estado_historico` ADD CONSTRAINT `tcc_estado_historico_ibfk_2` FOREIGN KEY (`status`) REFERENCES `tcc_estado`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_estado_historico` ADD CONSTRAINT `tcc_estado_historico_ibfk_3` FOREIGN KEY (`responsavel_orientador_id`) REFERENCES `orientador`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_metadata` ADD CONSTRAINT `tcc_metadata_ibfk_1` FOREIGN KEY (`tema_id`) REFERENCES `tcc_tema`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_metadata` ADD CONSTRAINT `tcc_metadata_ibfk_2` FOREIGN KEY (`classificacao_id`) REFERENCES `tcc_classificacao`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_metadata` ADD CONSTRAINT `tcc_metadata_ibfk_3` FOREIGN KEY (`orientador_id`) REFERENCES `orientador`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_metadata` ADD CONSTRAINT `tcc_metadata_ibfk_4` FOREIGN KEY (`turma_id`) REFERENCES `turma`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_metadata` ADD CONSTRAINT `tcc_metadata_ibfk_5` FOREIGN KEY (`aluno_id`) REFERENCES `aluno`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_nota_final` ADD CONSTRAINT `tcc_nota_final_ibfk_1` FOREIGN KEY (`tcc_id`) REFERENCES `tcc`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_palavra_chave_associacao` ADD CONSTRAINT `tcc_palavra_chave_associacao_ibfk_1` FOREIGN KEY (`tcc_id`) REFERENCES `tcc`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_palavra_chave_associacao` ADD CONSTRAINT `tcc_palavra_chave_associacao_ibfk_2` FOREIGN KEY (`palavra_id`) REFERENCES `tcc_palavra_chave`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_relatorio_progresso` ADD CONSTRAINT `tcc_relatorio_progresso_ibfk_1` FOREIGN KEY (`tcc_id`) REFERENCES `tcc`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tcc_relatorio_progresso_arquivo` ADD CONSTRAINT `tcc_relatorio_progresso_arquivo_ibfk_1` FOREIGN KEY (`relatorio_id`) REFERENCES `tcc_relatorio_progresso`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- RedefineIndex
CREATE UNIQUE INDEX `cpf` ON `aluno`(`cpf`);
DROP INDEX `Aluno_cpf_key` ON `aluno`;

-- RedefineIndex
CREATE UNIQUE INDEX `email` ON `aluno`(`email`);
DROP INDEX `Aluno_email_key` ON `aluno`;

-- RedefineIndex
CREATE UNIQUE INDEX `matricula` ON `aluno`(`matricula`);
DROP INDEX `Aluno_matricula_key` ON `aluno`;

-- RedefineIndex
CREATE UNIQUE INDEX `cpf` ON `orientador`(`cpf`);
DROP INDEX `Orientador_cpf_key` ON `orientador`;

-- RedefineIndex
CREATE UNIQUE INDEX `email` ON `orientador`(`email`);
DROP INDEX `Orientador_email_key` ON `orientador`;
