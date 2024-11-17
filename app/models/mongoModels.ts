import { ObjectId } from "mongodb"

// Representa as informações de um TCC
export interface ITcc {
  id: string // ID único do TCC
  titulo: string // Título do TCC
  aluno: {
    id: string
    nome: string
  } // Aluno associado
  orientador: {
    id: string
    nome: string
  } // Orientador associado
  tema: {
    id: string
    descricao: string
  } // Tema associado
  classificacao: {
    id: string
    descricao: string
  } // Classificação do TCC
  documentos: {
    tipo: string
    nome: string
    caminho: string
    formato: string
    data_envio: Date
    tamanho: number
  }[] // Lista de documentos do TCC
  palavras_chave: {
    id: string
    descricao: string
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
  }[] // Avaliações do TCC
  notaFinal: number | null // Nota final calculada
  status: string // Status do TCC
}

// Representa uma comunidade
export interface ICommunity {
  id: string // ID único da comunidade
  nome: string // Nome da comunidade
  descricao: string // Descrição da comunidade
  imagem_capa: string // URL da imagem de capa
  data_criacao: Date // Data de criação
  criador: {
    id: string
    tipo: "aluno" | "orientador"
  } // Criador da comunidade
  posts: {
    autor: {
      id: string
      tipo: "aluno" | "orientador"
    }
    conteudo: string
    data_postagem: Date
  }[] // Lista de posts
  seguidores: {
    id: string
    tipo: "aluno" | "orientador"
    data_seguimento: Date
  }[] // Lista de seguidores
}

// Representa uma turma
export interface IClass {
  id: string // ID único da turma
  nome: string // Nome da turma
  alunos: {
    id: string
    nome: string
  }[] // Lista de alunos
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
}
