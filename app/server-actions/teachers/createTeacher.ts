"use server"

import prisma from "@/app/lib/prisma"
import { IStudent } from "@/app/models/student/studentsModel"
import { handlePrismaError } from "@/app/utils/handle-error"

export async function createTeacher(teacherData: {
  nome: string
  email: string
  cpf: string
  telefone: string
  departamento: string
  titulo_academico: string
}) {
  try {
    const newOridentador = await prisma.orientador.create({
      data: teacherData,
    })
  } catch (error) {
    handlePrismaError(error)
  }
}
