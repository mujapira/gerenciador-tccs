export interface IDetailedStudent {
  id: number;
  nome: string;
  email: string;
  matricula: string;
  cpf: string;
  telefone: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  dataIngresso: Date;
  dataNascimento: Date;
  semestreAtual: number | null;
  turmas: IStudentTurma[];
  tcc: ITccDetails | null;
}

interface IStudentTurma {
  id: number;
  name: string;
}

interface ITccDetails {
  tccId: number;
  titulo: string;
  orientador: string;
  turma: string;
  tema: string;
  classificacao: string;
  notaFinal: string | null;
  estadoAtual: string | null;
  numeroAvaliacoes: number;
  dataUltimaAvaliacao: Date | null;
  palavrasChave: string | null;
}