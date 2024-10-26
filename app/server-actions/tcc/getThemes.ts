"use server"

import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"

export type ITheme = {
  id: number
  tema: string
  ocorrencias: number
}

export async function GetThemes() {
  try {
    const themes = await prisma.tcc_tema.findMany({})

    const temasAssociacao = await prisma.tcc_tema_associacao.findMany({})

    const parsedResult: ITheme[] = themes.map((tema) => ({
      id: tema.id,
      tema: tema.descricao,
      ocorrencias: temasAssociacao.filter(
        (association) => association.tema_id === tema.id
      ).length,
    }))

    return parsedResult
  } catch (error) {
    handlePrismaError(error)
  }
}
