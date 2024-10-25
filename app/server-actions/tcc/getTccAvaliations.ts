"use server"



import { ITccAvaliation } from "@/app/models/tcc/tccModel"
import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"

export async function GetTccAvaliations(id: number) {
  try {
    const avaliacoes = await prisma.tcc_avaliacao.findMany({
      where: {
        tcc_id: id,
      },
      orderBy: {
        numero_avaliacao: "asc",
      },
    })

    const parsedAvaliacoes: ITccAvaliation[] = avaliacoes.map((avaliacao) => ({
      id: avaliacao.id,
      tccId: avaliacao.tcc_id || null,
      orientadorId: avaliacao.orientador_id || null,
      dataAvaliacao: avaliacao.data_avaliacao,
      descricao: avaliacao.descricao,
      nota: Number(avaliacao.nota) || null,
      numeroAvaliacao: avaliacao.numero_avaliacao || null,
    }))

    return parsedAvaliacoes
  } catch (error) {
    handlePrismaError(error)
  }
}
