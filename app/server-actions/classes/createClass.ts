"use server"

import prisma from "@/app/lib/prisma"
import { IStudent } from "@/app/models/student/studentsModel"
import { handlePrismaError } from "@/app/utils/handle-error"
import { UpdateClassStudents } from "./updateClasseStudents"

export async function createClass(
  data: { nome: string },
  students: IStudent[]
) {
  try {
    const newClass = await prisma.turma.create({
      data: data,
    })

    if (newClass) {
      UpdateClassStudents(newClass.id, students)
    }
  } catch (error) {
    handlePrismaError(error)
  }
}
