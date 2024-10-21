"use server"

import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"

export type IKeyWord = {
  id: number
  palavra: string
  ocorrencias: number
}

export async function GetKeyWords() {
  try {
    
    const palavrasChave = await prisma.tcc_palavra_chave.findMany({})

    const palavrasChaveAssociation = await prisma.tcc_palavra_chave_associacao.findMany({})

    const parsedResult = palavrasChave.map((palavra) => ({
      id: palavra.id,
      palavra: palavra.palavra,
      ocorrencias: palavrasChaveAssociation.filter((association) => association.palavra_id === palavra.id).length
    }))

    return parsedResult
    
  } catch (error) {
    handlePrismaError(error)
  }
}
