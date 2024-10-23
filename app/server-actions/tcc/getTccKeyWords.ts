"use server"

import { ITccKeyWord } from "@/app/models/tcc/tccModel"
import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"

export async function GetTccKeyWords(id: number) {
  try {
    let methodResult: ITccKeyWord[] = []

    const palavrasChaveAssociadas =
      await prisma.tcc_palavra_chave_associacao.findMany({
        where: {
          tcc_id: id,
        },
      })

    const palavrasChave = await prisma.tcc_palavra_chave.findMany({
      where: {
        id: {
          in: palavrasChaveAssociadas.map(
            (association) => association.palavra_id
          ),
        },
      },
    })

    methodResult = palavrasChave.map((palavra) => ({
      id: palavra.id,
      palavra: palavra.palavra,
    }))

    return methodResult
  } catch (error) {
    handlePrismaError(error)
  }
}
