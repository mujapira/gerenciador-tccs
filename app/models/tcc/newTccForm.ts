export interface INewTccFormData {
  tcc: ITcc
  metadata: ITccMetadata
}

export interface ITcc {
  titulo: string
  metadata_id: number | null
  status: number
}

export interface ITccMetadata {
  tema_id: number
  classificacao_id: number
  orientador_id: number
  turma_id: number
  aluno_id: number
}