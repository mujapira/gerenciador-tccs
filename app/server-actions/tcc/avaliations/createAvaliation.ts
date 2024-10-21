"use server";

import prisma from "@/app/lib/prisma";
import { handlePrismaError } from "@/app/utils/handle-error";
import { Decimal } from "@prisma/client/runtime/library";

export async function createAvaliation(avaliacao: {
  tcc_id: number | null;
  orientador_id: number | null;
  data_avaliacao: Date;
  descricao: string;
  nota: number | null;
  numero_avaliacao: number | null;
}) {
  try {
    const novaAvaliacao = await prisma.tcc_avaliacao.create({
      data: avaliacao,
    });
  } catch (error) {
    handlePrismaError(error);
  }
}
