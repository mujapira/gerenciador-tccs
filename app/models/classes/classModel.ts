import { IStudent } from "../student/studentsModel"

export interface IClass {
  id: number
  nome: string
}

export interface IClassWithStudents extends IClass {
  alunos: IStudent[]
}