"use server"

import { IStudent } from "@/app/models/student/studentsModel"
import prisma from "../../lib/prisma"
import { IClass } from "../../models/classes/classModel"
import { handlePrismaError } from "../../utils/handle-error"

export async function UpdateClassStudents(
  classId: number,
  students: IStudent[]
) {
  try {
    const currentStudents = await prisma.aluno_turma.findMany({
      where: {
        turma_id: classId,
      },
    })

    const currentStudentIds = currentStudents.map((entry) => entry.aluno_id)
    const newStudentIds = students.map((student) => student.id)

    const studentsToRemove = currentStudentIds.filter(
      (id) => !newStudentIds.includes(id)
    )

    const studentsToAdd = newStudentIds.filter(
      (id) => !currentStudentIds.includes(id)
    )

    if (studentsToRemove.length > 0) {
      await prisma.aluno_turma.deleteMany({
        where: {
          turma_id: classId,
          aluno_id: {
            in: studentsToRemove,
          },
        },
      })
    }

    if (studentsToAdd.length > 0) {
      await prisma.aluno_turma.createMany({
        data: studentsToAdd.map((studentId) => ({
          aluno_id: studentId,
          turma_id: classId,
        })),
      })
    }
  } catch (error) {
    handlePrismaError(error)
  }
}
