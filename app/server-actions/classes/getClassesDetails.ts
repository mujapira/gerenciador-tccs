"use server"

import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"
import { IClassWithStudents } from "@/app/models/classes/classModel"
import { IStudent } from "@/app/models/student/studentsModel"

export async function GetClassesDetails() {
  try {
    const turmas = await prisma.turma.findMany()

    if (!turmas) {
      return null
    }

    const alunosTurma = await prisma.aluno_turma.findMany()

    if (!alunosTurma) {
      return null
    }

    const alunos = await prisma.aluno.findMany({
      where: {
        id: {
          in: alunosTurma.map((alunoTurma) => alunoTurma.aluno_id),
        },
      },
    })

    const turmasComAlunos: IClassWithStudents[] = []

    turmas.forEach((turma) => {
      const alunosDaTurma = alunosTurma
        .filter((alunoTurma) => alunoTurma.turma_id === turma.id)
        .map((alunoTurma) => {
          return alunos.find((aluno) => aluno.id === alunoTurma.aluno_id)
        })

      const turmaComAlunos: IClassWithStudents = {
        ...turma,
        alunos: alunosDaTurma as IStudent[],
      }

      turmasComAlunos.push(turmaComAlunos)
    })

    return turmasComAlunos
  } catch (error) {
    handlePrismaError(error)
  }
}
