"use server"

import { redirect } from "next/navigation"
import prisma from "../lib/prisma"
import { handlePrismaError } from "../utils/handle-error"

export async function createStudent(
  alunoData: {
    nome: string
    email: string
    matricula: string
    cpf: string
    telefone?: string
    endereco?: string
    cidade?: string
    estado?: string
    data_ingresso: Date
    data_nascimento: Date
    semestre_atual?: number
    caminho_foto?: string
  },
  turmaId?: number | null
) {
  try {
    const novoAluno = await prisma.aluno.create({
      data: alunoData,
    })

    if (turmaId) {
      const turma = await prisma.aluno_turma.create({
        data: {
          aluno_id: novoAluno.id,
          turma_id: turmaId,
        },
      })
      return { novoAluno, turma }
    }

    redirect("/alunos")
  } catch (error) {
    handlePrismaError(error)
  }
}
