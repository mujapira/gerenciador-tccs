"use server"

import { IDetailedStudent } from "./../models/detailedStudentModel"

import prisma from "../lib/prisma"

export async function GetStudentDetails(id: number) {
  try {
    const studentWithClasses = await prisma.aluno.findUnique({
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

    if (!studentWithClasses) {
      return null
    }

    const studentWithClassesParsed: IDetailedStudent = {
      id: studentWithClasses.id,
      nome: studentWithClasses.nome,
      email: studentWithClasses.email,
      matricula: studentWithClasses.matricula,
      cpf: studentWithClasses.cpf,
      telefone: studentWithClasses.telefone,
      endereco: studentWithClasses.endereco,
      cidade: studentWithClasses.cidade,
      estado: studentWithClasses.estado,
      dataIngresso: studentWithClasses.data_ingresso,
      dataNascimento: studentWithClasses.data_nascimento,
      semestreAtual: studentWithClasses.semestre_atual,
      turmas: studentWithClasses.aluno_turma.map((alunoTurma) => {
        return {
          id: alunoTurma.turma.id,
          name: alunoTurma.turma.nome,
        }
      }),
    }

    return studentWithClassesParsed
  } catch (error) {
    console.error("Erro ao buscar alunos:", error)
    return []
  }
}
