"use server"

import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"

export type IKeyWord = {
  id: number
  palavra: string
  ocorrencias: number
}

export async function AddKeyWord(data: { palavra: string }) {
  try {
    await prisma.tcc_palavra_chave.create({
      data: {
        palavra: data.palavra,
      },
    })
  } catch (error) {
    handlePrismaError(error)
  }
}
