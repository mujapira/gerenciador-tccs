"use server"

import prisma from "../lib/prisma"
import { IClass } from "../models/classModel"
import { handlePrismaError } from "../utils/handle-error"

export async function UpdateStudentClasses(
  studentId: number,
  classes: IClass[]
) {
  try {
    const turmas = await prisma.aluno_turma.findMany({
      where: {
        aluno_id: studentId,
      },
    })

    const classeCadastrada = turmas.map((turma) => turma.turma_id)

    const classeNova = classes.map((classe) => classe.id)

    const classeParaDeletar = classeCadastrada.filter(
      (classe) => !classeNova.includes(classe)
    )
    const classeParaAdicionar = classes.filter(
      (classe) => !classeCadastrada.includes(classe.id)
    )

    if (classeParaDeletar.length > 0) {
      await prisma.aluno_turma.deleteMany({
        where: {
          aluno_id: studentId,
          turma_id: {
            in: classeParaDeletar,
          },
        },
      })
    }

    if (classeParaAdicionar.length > 0) {
      await prisma.aluno_turma.createMany({
        data: classeParaAdicionar.map((classe) => ({
          aluno_id: studentId,
          turma_id: classe.id,
        })),
      })
    }
  } catch (error) {
    handlePrismaError(error)
  }
}
