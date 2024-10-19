export interface INewStudentFormData {
  nome: string
  email: string
  matricula: string
  cpf: string
  telefone?: string
  endereco?: string
  cidade?: string
  estado?: string
  data_ingresso: Date
  data_nascimento: Date
  semestre_atual?: number
  caminho_foto?: string
}
