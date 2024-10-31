"use server"
import prisma from "@/app/lib/prisma"
import { handlePrismaError } from "@/app/utils/handle-error"

export interface ITccClassificationChart {
  classification: string
  occurrences: number
}

export async function getTccClassificationChartData() {
  try {
    const classifications = await prisma.tcc_classificacao.findMany({
      include: {
        tcc_metadata: {
          select: {
            tcc: true,
          },
        },
      },
    })

    const classificationCounts: ITccClassificationChart[] = classifications.map(
      (classification) => ({
        classification: classification.descricao,
        occurrences: classification.tcc_metadata.length,
      })
    )
    
    return classificationCounts
  } catch (error) {
    handlePrismaError(error)
  }
}
