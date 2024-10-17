"use server"

import prisma from "../lib/prisma"

export async function createStudent(alunoData: {
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
}) {
  const novoAluno = await prisma.aluno.create({
    data: alunoData,
  })

  return novoAluno
}
