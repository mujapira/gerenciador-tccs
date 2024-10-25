export interface ITccDetailed {
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
  palavrasChave: ITccKeyWord[] | null
  avaliacoes: ITccAvaliation[] | null
  documentos: ITccDocument[] | null
}

export interface ITccKeyWord {
  id: number
  palavra: string
}

export interface ITccAvaliation {
  id: number
  tccId: number | null
  orientadorId: number | null
  dataAvaliacao: Date
  descricao: string
  nota: number | null
  numeroAvaliacao: number | null
}

export interface ITccDocument {
  id: number
  tccId: number
  tipoDocumentoId: number
  nomeDocumento: string
  caminhoArquivo: string
  formatoDocumento: string
  dataEnvio: Date
  tamanhoArquivo: number | null
}
