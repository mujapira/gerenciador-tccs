"use server"

import { ITccDocument } from "@/app/models/tcc/tccModel"
import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"

export async function GetTccDocument(id: number) {
  try {
    let response: ITccDocument[] = []

    const document = await prisma.tcc_documento.findMany({
      where: {
        tcc_id: id,
      },
    })

    response = document.map((doc) => {
      return {
        id: doc.id,
        tccId: doc.tcc_id,
        tipoDocumentoId: doc.tipo_documento_id,
        nomeDocumento: doc.nome_documento,
        caminhoArquivo: doc.caminho_arquivo,
        formatoDocumento: doc.formato_documento,
        dataEnvio: doc.data_envio,
        tamanhoArquivo: doc.tamanho_arquivo,
      }
    })

    return response
  } catch (error) {
    handlePrismaError(error)
  }
}
