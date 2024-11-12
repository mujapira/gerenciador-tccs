export interface ICommunityOverview {
  id: number
  nome: string
  imagemCapa: string | null
  quantidadeSeguidores: number
  descricao: string | null
  criador: {
    id: number
    nome: string
    img: string
    tipo: "Aluno" | "Orientador"
  }
}

export interface ICommunityDetails extends ICommunityOverview {
  descricao: string | null
  dataCriacao: Date
  posts: {
    id: number
    conteudo: string
    dataPostagem: Date
    autor: {
      id: number
      nome: string
      img: string
      tipo: "Aluno" | "Orientador"
    }
  }[]
  seguidores: {
    id: number
    nome: string
    img: string
    tipo: "Aluno" | "Orientador"
  }[]
}
