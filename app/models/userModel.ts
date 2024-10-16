export interface IUser {
  id: number
  nome: string
  email: string
  matricula: string
  cpf: string
  telefone: string | null
  endereco: string | null
  cidade: string | null
  estado: string | null
  data_ingresso: Date
  data_nascimento: Date
  semestre_atual: number | null
}
