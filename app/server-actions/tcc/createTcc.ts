"use server"

import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"

export async function CreateTcc(
  tcc: {
    titulo: string
    metadata_id: number | null
    status: number
  },
  metadata: {
    tema_id: number
    classificacao_id: number
    orientador_id: number
    turma_id: number
    aluno_id: number
  }
) {
  try {
    const tccMetadataResponse = await prisma.tcc_metadata.create({
      data: {
        tema_id: metadata.tema_id,
        classificacao_id: metadata.classificacao_id,
        orientador_id: metadata.orientador_id,
        turma_id: metadata.turma_id,
        aluno_id: metadata.aluno_id,
      },
    })

    await prisma.tcc.create({
      data: {
        titulo: tcc.titulo,
        status: tcc.status,
        metadata_id: tccMetadataResponse.id,
      },
    })
  } catch (error) {
    handlePrismaError(error)
  }
}