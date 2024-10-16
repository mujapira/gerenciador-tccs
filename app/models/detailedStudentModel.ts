export interface IDetailedStudent {
  id: number
  nome: string
  email: string
  matricula: string
  cpf: string
  telefone: string | null
  endereco: string | null
  cidade: string | null
  estado: string | null
  dataIngresso: Date
  dataNascimento: Date
  semestreAtual: number | null

  turmas: IStudentTurma[]
}

interface IStudentTurma {
  id: number
  name: string
}
