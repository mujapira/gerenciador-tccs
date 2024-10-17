import { Prisma } from "@prisma/client"

export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    throw new Error("Erro ao processar a operação: " + error.message)
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new Error("Erro desconhecido ao processar a operação.")
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    throw new Error(
      "Erro crítico ao processar a operação. Tente novamente mais tarde."
    )
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new Error(
      "Erro ao inicializar o Prisma. Verifique sua conexão com o banco de dados."
    )
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    throw new Error("Erro de validação: " + error.message)
  } else if (error instanceof Error) {
    throw new Error("Erro inesperado: " + error.message)
  } else {
    throw new Error("Ocorreu um erro inesperado.")
  }
}
