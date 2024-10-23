"use server"

import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"
import { updateTccState } from "../procedures/updateTccState"

export async function AddNewAvaliation(data: {
  numeroAvaliacao: number
  nota: number
  dataAvaliacao: Date
  descricao: string
  tccId: number
  orientadorId: number
}) {
  try {
    
    await prisma.tcc_avaliacao.create({
      data: {
        numero_avaliacao: data.numeroAvaliacao,
        nota: data.nota,
        data_avaliacao: data.dataAvaliacao,
        descricao: data.descricao,
        tcc_id: data.tccId,
        orientador_id: data.orientadorId,
      },
    })

    await updateTccState(data.tccId, data.orientadorId)
    
  } catch (error) {
    handlePrismaError(error)
  }
}
