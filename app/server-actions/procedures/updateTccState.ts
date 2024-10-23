"use server"

import prisma from "@/app/lib/prisma"
import { handlePrismaError } from "@/app/utils/handle-error"
import { Decimal } from "@prisma/client/runtime/library"

export async function updateTccState(tccId: number, orientadorId: number) {
  try {

    const qtdAvaliacoes = await prisma.tcc_avaliacao.count({
      where: { tcc_id: tccId },
    })

    let novoEstado = 1
    let notaFinal = null

    if (qtdAvaliacoes === 3) {
      const mediaNotas = await prisma.tcc_avaliacao.aggregate({
        _avg: { nota: true },
        where: { tcc_id: tccId },
      })

      notaFinal = Number(mediaNotas._avg.nota) ?? 0

      novoEstado = notaFinal >= 6.0 ? 2 : 3

      const targetId = await prisma.tcc_nota_final.findFirst({
        where: { tcc_id: tccId },
        select: { id: true },
      })

      if (!targetId) {
        await prisma.tcc_nota_final.create({
          data: {
            tcc_id: tccId,
            nota_final: new Decimal(notaFinal),
            data_calculo: new Date(),
          },
        })
      }

      await prisma.tcc_nota_final.updateMany({
        where: { tcc_id: tccId },
        data: {
          nota_final: new Decimal(notaFinal),
          data_calculo: new Date(),
        },
      })
    }

    await prisma.tcc.update({
      where: { id: tccId },
      data: { status: novoEstado },
    })

    await prisma.tcc_estado_historico.create({
      data: {
        tcc_id: tccId,
        status: novoEstado,
        data_status: new Date(),
        responsavel_orientador_id: orientadorId,
      },
    })
  } catch (error) {
    handlePrismaError(error)
  }
}
