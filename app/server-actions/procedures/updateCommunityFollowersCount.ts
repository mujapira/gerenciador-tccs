"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function atualizarQuantidadeSeguidores() {
  try {
    const comunidades = await prisma.comunidade.findMany({
      select: {
        id: true,
      },
    })

    for (const comunidade of comunidades) {
      const seguidoresCount = await prisma.comunidade_seguidor.count({
        where: { comunidade_id: comunidade.id },
      })

      await prisma.comunidade.update({
        where: { id: comunidade.id },
        data: { quantidade_seguidores: seguidoresCount },
      })
    }

    console.log("Quantidade de seguidores atualizada com sucesso!")
  } catch (error) {
    console.error("Erro ao atualizar quantidade de seguidores:", error)
  } finally {
    await prisma.$disconnect()
  }
}
