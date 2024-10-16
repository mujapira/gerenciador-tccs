"use server"

import prisma from "../lib/prisma"


export async function GetStudent(id: number) {

  try {
    const alunoComTurma = await prisma.aluno.findUnique({
      where: {
        id: id,
      },
      include: {
        aluno_turma: {
          include: {
            turma: true,
          },
        },
      },
    })

    return alunoComTurma

  } catch (error) {
    console.error("Erro ao buscar alunos:", error)
    return []
  }
}
