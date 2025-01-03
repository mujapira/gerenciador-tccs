export interface ITcc {
  id: string
  titulo: string
  aluno: IStudent
  orientador: ITeacher
  tema: {
    id: string
    descricao: string
  }
  classificacao: {
    id: string
    descricao: string
  }
  documentos: {
    tipo: string
    nome: string
    caminho: string
    formato: string
    data_envio: Date
    tamanho: number
  }[]
  palavras_chave: {
    id: string
    palavra: string
  }[]
  avaliacoes: {
    numero: number
    orientador: {
      id: string
      nome: string
    }
    data_avaliacao: Date
    descricao: string
    nota: number
  }[]
  notaFinal: number | null
  status: {
    id: string
    descricao: string
  }
}

export interface ITheme {
  id: string
  descricao: string
}

export interface IClassification {
  id: string
  descricao: string
}

export interface IKeyword {
  id: string
  palavra: string
}

export interface ICommunityFromBase {
  id: string // ID único da comunidade
  nome: string // Nome da comunidade
  descricao: string // Descrição da comunidade
  imagem_capa: string // URL da imagem de capa
  data_criacao: Date // Data de criação
  criador: {
    id: string
    tipo: "aluno" | "orientador" | string
  } // Criador da comunidade
  posts: {
    autor: {
      id: string
      tipo: "aluno" | "orientador" | string
    }
    conteudo: string
    data_postagem: Date
  }[] // Lista de posts
  seguidores: {
    id: string
    tipo: "aluno" | "orientador" | string
    data_seguimento: Date
  }[] // Lista de seguidores
}

export interface ICommunity {
  id: string
  nome: string
  descricao: string
  imagem_capa: string
  data_criacao: Date
  criador: {
    info: IStudent | ITeacher
    tipo: "aluno" | "orientador"
  }
  posts: {
    autor: {
      info: IStudent | ITeacher
      tipo: "aluno" | "orientador"
    }
    conteudo: string
    data_postagem: Date
  }[]
  seguidores: {
    info: IStudent | ITeacher
    tipo: "aluno" | "orientador"
    data_seguimento: Date
  }[]
}

// Representa uma turma
export interface IClass {
  id: string // ID único da turma
  nome: string // Nome da turma
  alunos: IStudent[] // Lista de alunos da turma
}

export interface IOccurrencesChartData {
  name: string | number
  occurrences: number
}

export interface IStudent {
  id: string
  nome: string
  email: string
  matricula: string
  cpf: string
  telefone: string
  endereco: string
  cidade: string
  estado: string
  data_ingresso: Date
  data_nascimento: Date
  semestre_atual: number
  caminho_foto: string
  turma_id: string
  turma_nome: string
  tcc?: ITcc
}

export interface ITeacher {
  id: string
  nome: string
  email: string
  cpf: string
  telefone: string
  departamento: string
  titulo_academico: string
  caminho_foto: string
}

export interface IUpdateStudentFormData {
  data: {
    nome: string
    email: string
    matricula: string
    cpf: string
    telefone: string
    endereco: string
    cidade: string
    estado: string
    data_nascimento: Date
    semestre_atual: number
    caminho_foto: string
  }
  id: string
}

export interface ICreateStudentFormData {
  nome: string
  email: string
  matricula: string
  cpf: string
  telefone: string
  endereco: string
  cidade: string
  estado: string
  data_nascimento: Date
  semestre_atual: number
  caminho_foto: string
  turma_id: string
  turma_nome: string
}

export interface ICreateTeacherFormData {
  nome: string
  email: string
  cpf: string
  telefone: string
  departamento: string
  titulo_academico: string
  caminho_foto: string
}

export interface IUpdateTeacherFormData {
  data: {
    nome: string
    email: string
    cpf: string
    telefone: string
    departamento: string
    titulo_academico: string
    caminho_foto: string
  }
  id: string
}
