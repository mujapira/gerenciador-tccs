"use server"

import { IDetailedStudent } from "../models/detailedStudentModel"

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

    const tcc = await prisma.tcc_metadata.findFirst({
      where: {
        aluno_id: studentWithClasses.id,
      },
    })

    const tccDetails = await prisma.vw_tcc_detalhado.findFirst({
      where: {
        tcc_id: tcc?.id,
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
      turmas: studentWithClasses.aluno_turma.map((alunoTurma) => ({
        id: alunoTurma.turma.id,
        name: alunoTurma.turma.nome,
      })),
      tcc: tccDetails
        ? {
            tccId: tccDetails.tcc_id,
            titulo: tccDetails?.titulo_tcc,
            orientador: tccDetails?.nome_orientador,
            turma: tccDetails?.nome_turma,
            tema: tccDetails?.tema,
            classificacao: tccDetails?.classificacao,
            notaFinal: tccDetails?.nota_final,
            estadoAtual: tccDetails?.estado_atual,
            numeroAvaliacoes: Number(tccDetails?.numero_avaliacoes),
            dataUltimaAvaliacao: tccDetails?.data_ultima_avaliacao,
            palavrasChave: tccDetails?.palavras_chave,
          }
        : null,
    }

    return studentWithClassesParsed
  } catch (error) {
    console.error("Erro ao buscar alunos:", error)
    return []
  }
}
