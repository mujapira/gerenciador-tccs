export interface CommunityOverview {
  id: number
  nome: string
  imagemCapa: string | null
  quantidadeSeguidores: number
  descricao: string | null
  criador: {
    id: number
    nome: string
    tipo: "Aluno" | "Orientador"
  }
}

export interface CommunityDetails extends CommunityOverview {
  descricao: string | null
  dataCriacao: Date
  posts: {
    id: number
    conteudo: string
    dataPostagem: Date
    autor: {
      id: number
      nome: string
      tipo: "Aluno" | "Orientador"
    }
  }[]
  seguidores: {
    id: number
    nome: string
    tipo: "Aluno" | "Orientador"
  }[]
}
