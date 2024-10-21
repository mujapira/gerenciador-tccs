"use server"

import { ITeacher } from "@/app/models/teacher/teacherModel"
import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"

export async function GetTeachers() {
  try {
    const teachers = await prisma.orientador.findMany()

    const parsedTeachers = teachers.map((teacher) => {
      return {
        id: teacher.id,
        nome: teacher.nome,
        email: teacher.email,
        cpf: teacher.cpf,
        telefone: teacher.telefone,
        departamento: teacher.departamento,
        tituloAcademico: teacher.titulo_academico,
        caminhoFoto: "/user-images/placeholder.png",
      } as ITeacher
    })

    return parsedTeachers
  } catch (error) {
    handlePrismaError(error)
  }
}
