"use server"

import { IDetailedStudent } from "../../models/student/detailedStudentModel"

import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"

export async function GetStudentDetails(id: number) {
  try {
    const student = await prisma.aluno.findUnique({
      where: {
        id: id,
      },
    })

    if (!student) {
      return null
    }

    const studentClassesRelation = await prisma.aluno_turma.findMany({
      where: {
        aluno_id: student.id,
      },
    })

    const classes = await prisma.turma.findMany({
      where: {
        id: {
          in: studentClassesRelation.map((relation) => relation.turma_id),
        },
      },
    })

    const tccMetadata = await prisma.tcc_metadata.findFirst({
      where: {
        aluno_id: student.id,
      },
    })

    const tccDetails = await prisma.vw_tcc_detalhado.findFirst({
      where: {
        tcc_id: tccMetadata?.id,
      },
    })

    const tccKeyWords = await prisma.tcc_palavra_chave_associacao.findMany({
      where: {
        tcc_id: tccMetadata?.id,
      },
      select: {
        palavra_id: true,
        tcc_palavra_chave: {
          select: {
            palavra: true,
          },
        },
      },
    })

    if (!student) {
      return null
    }

    const tccKeyWordsParsed = tccKeyWords.map((keyWord) => ({
      wordId: keyWord.palavra_id,
      word: keyWord.tcc_palavra_chave.palavra,
    }))

    const studentParsed: IDetailedStudent = {
      id: student.id,
      nome: student.nome,
      email: student.email,
      matricula: student.matricula,
      cpf: student.cpf,
      telefone: student.telefone,
      endereco: student.endereco,
      cidade: student.cidade,
      estado: student.estado,
      dataIngresso: student.data_ingresso,
      dataNascimento: student.data_nascimento,
      semestreAtual: student.semestre_atual,
      photoPath: student.caminho_foto ?? "/placeholder.png",
      turmas: classes,
      tcc:
        tccMetadata && tccDetails
          ? {
              tccId: tccDetails.tcc_id,
              titulo: tccDetails?.titulo_tcc,
              orientador: tccDetails?.nome_orientador,
              orientadorId: tccMetadata?.orientador_id ?? null,
              turma: tccDetails?.nome_turma,
              turmaId: tccMetadata?.turma_id ?? null,
              tema: tccDetails?.tema,
              temaId: tccMetadata?.tema_id ?? null,
              classificacao: tccDetails?.classificacao,
              classificacaoId: tccMetadata?.classificacao_id ?? null,
              notaFinal: tccDetails?.nota_final,
              estadoAtual: tccDetails?.estado_atual,
              numeroAvaliacoes: Number(tccDetails?.numero_avaliacoes),
              dataUltimaAvaliacao: tccDetails?.data_ultima_avaliacao,
              palavrasChave: tccKeyWordsParsed,
            }
          : null,
    }

    return studentParsed
  } catch (error) {
    handlePrismaError(error)
  }
}
