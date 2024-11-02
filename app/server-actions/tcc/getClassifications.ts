'use server'

import prisma from "@/app/lib/prisma"
import { handlePrismaError } from "@/app/utils/handle-error"

export async function GetTccClassifications() {
  try {
    const classifications = await prisma.tcc_classificacao.findMany()
    console.log(classifications)
    return classifications

  } catch (error) {
    handlePrismaError(error)
  }
}
