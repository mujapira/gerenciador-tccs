"use server"

import prisma from "../lib/prisma"
import { IClass } from "../models/classModel"

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
    console.error("Erro ao buscar alunos:", error)
    return []
  }
}
