"use server"

import prisma from "../../lib/prisma"
import { IClass } from "../../models/classes/classModel"
import { handlePrismaError } from "../../utils/handle-error"
import { UpdateStudentClasses } from "../student/updateStudentClasses"


export async function createStudent(
  alunoData: {
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
  },
  classes: IClass[]
) {
  try {
    const novoAluno = await prisma.aluno.create({
      data: alunoData,
    })

    if (classes.length) {
      UpdateStudentClasses(novoAluno.id, classes)
    }
  } catch (error) {
    handlePrismaError(error)
  }
}
