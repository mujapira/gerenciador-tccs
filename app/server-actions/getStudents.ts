"use server"

import prisma from "../lib/prisma"
import { handlePrismaError } from "../utils/handle-error"

export async function GetStudents() {
  try {
    const alunos = await prisma.aluno.findMany()

    const alunosIUser = alunos.map((aluno) => {
      return {
        id: aluno.id,
        nome: aluno.nome,
        email: aluno.email,
        matricula: aluno.matricula,
        cpf: aluno.cpf,
        telefone: aluno.telefone,
        endereco: aluno.endereco,
        cidade: aluno.cidade,
        estado: aluno.estado,
        data_ingresso: aluno.data_ingresso,
        data_nascimento: aluno.data_nascimento,
        semestre_atual: aluno.semestre_atual,
        caminho_foto: aluno.caminho_foto,
      }
    })

    return alunosIUser
  } catch (error) {
    handlePrismaError(error)
  }
}
