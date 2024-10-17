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

    const tccKeyWords = await prisma.tcc_palavra_chave_associacao.findMany({
      where: {
        tcc_id: tcc?.id,
      },
      select: {
        palavra_id: true,
        tcc_palavra_chave: {
          select: {
            palavra: true,
          },
        }
      }
    })

    if (!studentWithClasses) {
      return null
    }

    const tccKeyWordsParsed = tccKeyWords.map((keyWord) => ({
      wordId: keyWord.palavra_id,
      word: keyWord.tcc_palavra_chave.palavra,
    }))

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
            orientadorId: tcc?.orientador_id ?? null,
            turma: tccDetails?.nome_turma,
            turmaId: tcc?.turma_id ?? null,
            tema: tccDetails?.tema,
            temaId: tcc?.tema_id ?? null,
            classificacao: tccDetails?.classificacao,
            classificacaoId: tcc?.classificacao_id ?? null,
            notaFinal: tccDetails?.nota_final,
            estadoAtual: tccDetails?.estado_atual,
            numeroAvaliacoes: Number(tccDetails?.numero_avaliacoes),
            dataUltimaAvaliacao: tccDetails?.data_ultima_avaliacao,
            palavrasChave: tccKeyWordsParsed,
          }
        : null,
    }

    return studentWithClassesParsed
  } catch (error) {
    console.error("Erro ao buscar alunos:", error)
    return []
  }
}
