import { IClass } from "./classModel";

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
  turmas: IClass[];
  tcc: ITccDetails | null;
  photoPath: string;
}



interface ITccDetails {
  tccId: number;
  titulo: string;
  orientador: string;
  orientadorId: number | null;
  turma: string;
  turmaId: number | null;
  tema: string;
  temaId: number | null;
  classificacao: string;
  classificacaoId: number | null;
  notaFinal: string | null;
  estadoAtual: string | null;
  numeroAvaliacoes: number;
  dataUltimaAvaliacao: Date | null;
  palavrasChave: IKeyWords[];
}

interface IKeyWords {
  wordId: number;
  word: string;
}