"use server"

import { ITccKeyWord } from "@/app/models/tcc/tccModel"
import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"

export interface ITccGradeChart {
  tccId: number
  grade: number
  occurrences: number
}

export async function GetTccGradesChartData() {
  try {
    const grades = await prisma.tcc_nota_final.findMany()

    const gradeOccurrences: { [key: number]: number } = {}
    for (let i = 0; i <= 10; i++) {
      gradeOccurrences[i] = 0
    }

    grades.forEach((grade) => {
      const roundedGrade = Math.round(Number(grade.nota_final))
      gradeOccurrences[roundedGrade] = (gradeOccurrences[roundedGrade] || 0) + 1
    })

    const methodResult: ITccGradeChart[] = Object.entries(gradeOccurrences).map(
      ([grade, occurrences]) => ({
        tccId: parseInt(grade),
        grade: parseInt(grade),
        occurrences,
      })
    )

    return methodResult
  } catch (error) {
    handlePrismaError(error)
  }
}
