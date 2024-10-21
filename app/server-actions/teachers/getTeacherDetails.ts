"use server"

import { IDetailedStudent } from "../../models/student/detailedStudentModel"

import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"
import { IDetailedTeacher } from "@/app/models/teacher/teacherModel"

export async function GetTeacherDetails(id: number) {
  try {
    const teacher = await prisma.orientador.findUnique({
      where: {
        id: id,
      },
    })

    if (!teacher) {
      return null
    }

    const tccMetadata = await prisma.tcc_metadata.findFirst({
      where: {
        aluno_id: teacher.id,
      },
    })

    const tccDetails = await prisma.vw_tcc_detalhado.findMany({
      where: {
        tcc_id: tccMetadata?.id,
      },
    })

    //remove os tccs repetidos
    const tccDetailsFiltered = tccDetails.filter(
      (tcc, index, self) =>
        index === self.findIndex((t) => t.tcc_id === tcc.tcc_id)
    )

    if (!tccDetails) {
      return []
    }
    const palavrasChave = await prisma.tcc_palavra_chave.findMany({})

    const getPalavrasChave = (ids: string | null) => {
      if (!ids) return []
      const uniqueIds = Array.from(new Set(ids.split(",").map(Number)))

      return palavrasChave
        .filter((palavra) => uniqueIds.includes(palavra.id))
        .map((palavra) => palavra)
    }

    const parsedResult = tccDetailsFiltered.map((tcc) => ({
      tccId: tcc.tcc_id,
      tituloTcc: tcc.titulo_tcc,
      alunoId: tcc.aluno_id,
      nomeAluno: tcc.nome_aluno,
      dataIngressoAluno: tcc.data_ingresso_aluno,
      orientadorId: tcc.orientador_id,
      nomeOrientador: tcc.nome_orientador,
      turmaId: tcc.turma_id,
      nomeTurma: tcc.nome_turma,
      temaId: tcc.tema_id,
      tema: tcc.tema,
      classificacaoId: tcc.classificacao_id,
      classificacao: tcc.classificacao,
      notaFinal: tcc.nota_final,
      estadoId: tcc.estado_id,
      estadoAtual: tcc.estado_atual,
      numeroAvaliacoes: Number(tcc.numero_avaliacoes),
      dataUltimaAvaliacao: tcc.data_ultima_avaliacao,
      palavrasChave: getPalavrasChave(tcc.palavras_chave_ids),
      palavrasChaveIds: tcc.palavras_chave_ids,
    }))

    const studentParsed: IDetailedTeacher = {
      id: teacher.id,
      nome: teacher.nome,
      email: teacher.email,
      cpf: teacher.cpf,
      telefone: teacher.telefone,
      tituloAcademico: teacher.titulo_academico,
      departamento: teacher.departamento,
      caminhoFoto: "/user-images/placeholder.png",
      tcc: parsedResult,
    }

    return studentParsed
  } catch (error) {
    handlePrismaError(error)
  }
}
