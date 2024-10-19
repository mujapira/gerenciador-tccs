"use server"

import prisma from "../lib/prisma"
import { IClass } from "../models/classModel"
import { handlePrismaError } from "../utils/handle-error"
import { UpdateStudentClasses } from "./UpdateStudentClasses"

export async function updateStudent(
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
    id: number
  },
  classes?: IClass[]
) {
  try {
    await prisma.aluno.update({
      where: {
        id: alunoData.id,
      },
      data: alunoData,
    })

    if (classes) {
      await UpdateStudentClasses(alunoData.id, classes)
    }
  } catch (error) {
    handlePrismaError(error)
  }
}
