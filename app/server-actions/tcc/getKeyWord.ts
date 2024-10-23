"use server"

import { ITccDetailed } from "@/app/models/tcc/tccModel"
import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"
import { GetTccsDetails } from "./getTccsDetails"

export type IKeyWordDetails = {
  id: number
  palavra: string
  ocorrencias: number
  tccs: ITccDetailed[] | null
}

export async function GetKeyWord(id: number) {
  try {
    const palavraChave = await prisma.tcc_palavra_chave.findMany({
      where: {
        id,
      },
    })

    const palavrasChaveAssociation =
      await prisma.tcc_palavra_chave_associacao.findMany({})

    const parsedResult = palavraChave.map((palavra) => ({
      id: palavra.id,
      palavra: palavra.palavra,
      ocorrencias: palavrasChaveAssociation.filter(
        (association) => association.palavra_id === palavra.id
      ).length,
    }))

    const tccsIds = palavrasChaveAssociation.map(
      (association) => association.tcc_id
    )

    const tccsDetails = await GetTccsDetails()

    const parsedTccs = tccsDetails.filter((tcc) =>
      tccsIds.includes(tcc.tccId)
    )

    const parsedResponse = {
      ...parsedResult[0],
      tccs: parsedTccs,
    }

    return parsedResponse
  } catch (error) {
    handlePrismaError(error)
  }
}
