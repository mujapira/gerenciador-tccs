"use server"

import { ITccDetailed } from "@/app/models/tcc/tccModel"
import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"
import { GetTccAvaliations } from "./getTccAvaliations"
import { GetTccKeyWords } from "./getTccKeyWords"

export async function GetTccsDetails() {
  try {
    let methodResponse: ITccDetailed[] = []

    const result = await prisma.vw_tcc_detalhado.findMany({})

    methodResponse = await Promise.all(
      result.map(async (tcc) => ({
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
        palavrasChave: (await GetTccKeyWords(tcc.tcc_id)) || [],
        avaliacoes: (await GetTccAvaliations(tcc.tcc_id)) || [],
      }))
    )

    return methodResponse
  } catch (error) {
    handlePrismaError(error)
  }
}
