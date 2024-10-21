"use server"

import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"

export async function GetTccsDetails() {
  try {
    const result = await prisma.vw_tcc_detalhado.findMany({})
    const palavrasChave = await prisma.tcc_palavra_chave.findMany({})

    // Função auxiliar para obter palavras-chave pelo ID
    const getPalavrasChave = (ids: string | null) => {
      // Converte os IDs para um array de números únicos
      if (!ids) return []
      const uniqueIds = Array.from(new Set(ids.split(",").map(Number)))

      // Filtra as palavras-chave com base nos IDs
      return palavrasChave
        .filter((palavra) => uniqueIds.includes(palavra.id))
        .map((palavra) => palavra)
    }

    //tire os tccs com ids repetido

    const cleared = result.filter((tcc, index, self) => {
      return index === self.findIndex((t) => t.tcc_id === tcc.tcc_id)
    })

    const parsedResult = cleared.map((tcc) => ({
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

    return parsedResult
  } catch (error) {
    handlePrismaError(error)
  }
}
