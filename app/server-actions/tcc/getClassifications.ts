import prisma from "@/app/lib/prisma"
import { handlePrismaError } from "@/app/utils/handle-error"

export async function GetTccClassifications() {
  try {
    return await prisma.tcc_classificacao.findMany()
  } catch (error) {
    handlePrismaError(error)
  }
}
