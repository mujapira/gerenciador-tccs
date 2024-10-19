"use server"

import prisma from "../../lib/prisma"
import { IClass } from "../../models/classes/classModel"
import { handlePrismaError } from "../../utils/handle-error"

export async function GetClasses() {
  try {
    const classes = await prisma.turma.findMany()

    const parsedClasses: IClass[] = classes
      .map((c) => ({
        id: c.id,
        nome: c.nome,
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome))

    return parsedClasses
  } catch (error) {
    handlePrismaError(error)
  }
}
