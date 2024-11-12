"use server"

import prisma from "@/app/lib/prisma"
import { ICommunityDetails } from "@/app/models/community/communityModel"
import { handlePrismaError } from "@/app/utils/handle-error"

export async function GetCommunityDetails(id: number) {
  try {
    const community = await prisma.comunidade.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        descricao: true,
        data_criacao: true,
        imagem_capa: true,
        criador_aluno_id: true,
        criador_orientador_id: true,
        aluno: { select: { id: true, nome: true, caminho_foto: true } },
        orientador: { select: { id: true, nome: true } },
        _count: {
          select: { comunidade_seguidor: true },
        },
        comunidade_post: {
          select: {
            id: true,
            conteudo: true,
            data_postagem: true,
            aluno: { select: { id: true, nome: true, caminho_foto: true } },
            orientador: { select: { id: true, nome: true } },
          },
        },
        comunidade_seguidor: {
          select: {
            aluno: { select: { id: true, nome: true, caminho_foto: true } },
            orientador: { select: { id: true, nome: true } },
          },
        },
      },
    })

    if (!community) return undefined

    const criador = community.aluno
      ? {
          id: community.aluno.id,
          nome: community.aluno.nome,
          tipo: "Aluno" as const,
          img: community.aluno.caminho_foto || "/user-images/placeholder.png",
        }
      : {
          id: community.orientador?.id!,
          nome: community.orientador?.nome!,
          tipo: "Orientador" as const,
          img: "/user-images/placeholder.png",
        }

    const communityDetails: ICommunityDetails = {
      id: community.id,
      nome: community.nome,
      imagemCapa: community.imagem_capa,
      descricao: community.descricao,
      dataCriacao: community.data_criacao,
      quantidadeSeguidores: community._count.comunidade_seguidor,
      criador,
      posts: community.comunidade_post.map((post) => ({
        id: post.id,
        conteudo: post.conteudo,
        dataPostagem: post.data_postagem,
        autor: post.aluno
          ? {
              id: post.aluno.id,
              nome: post.aluno.nome,
              tipo: "Aluno" as const,
              img: post.aluno.caminho_foto || "/user-images/placeholder.png",
            }
          : {
              id: post.orientador!.id,
              nome: post.orientador!.nome,
              tipo: "Orientador" as const,
              img: "/user-images/placeholder.png",
            },
      })),
      seguidores: community.comunidade_seguidor.map((seguidor) => ({
        id: seguidor.aluno?.id || seguidor.orientador?.id!,
        nome: seguidor.aluno?.nome || seguidor.orientador?.nome!,
        tipo: seguidor.aluno ? "Aluno" : "Orientador",
        img: seguidor.aluno?.caminho_foto || "/user-images/placeholder.png",
      })),
    }

    return communityDetails
  } catch (error) {
    handlePrismaError(error)
  }
}
