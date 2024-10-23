import { ITccDetailed } from "../tcc/tccModel"

export interface ITeacher {
  id: number
  nome: string
  email: string
  cpf: string
  telefone: string | null
  caminhoFoto: string | null
  tituloAcademico: string 
  departamento: string
}

export interface IDetailedTeacher extends ITeacher {
  tcc: ITccDetailed[] | null
}