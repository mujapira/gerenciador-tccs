export interface ITccDetalhado {
  tccId: number
  tituloTcc: string
  alunoId: number
  nomeAluno: string
  dataIngressoAluno: Date
  orientadorId: number
  nomeOrientador: string
  turmaId: number
  nomeTurma: string
  temaId: number
  tema: string
  classificacaoId: number
  classificacao: string
  notaFinal: string | null
  estadoId: number | null
  estadoAtual: string | null
  numeroAvaliacoes: number
  dataUltimaAvaliacao: Date | null
  palavrasChave: IPalavrasChave[] | null
  palavrasChaveIds: string | null

}

export interface IPalavrasChave {
  id: number
  palavra: string
}
