"use server"

import {
  FilterCreator,
  FilterFollowers,
} from "@/app/components/community-related/community-list"
import prisma from "../../lib/prisma"
import { handlePrismaError } from "../../utils/handle-error"
import { ICommunityOverview } from "@/app/models/community/communityModel"

type props = {
  page: number
  itemsPerPage: number
  creatorFilter: FilterCreator
  followersFilter: FilterFollowers
}

export async function GetCommunityOverview({
  page,
  itemsPerPage,
  creatorFilter,
  followersFilter,
}: props) {
  try {
    const offset = (page - 1) * itemsPerPage

    const creatorCondition =
      creatorFilter === "Aluno"
        ? { criador_aluno_id: { not: null }, criador_orientador_id: null }
        : creatorFilter === "Orientador"
        ? { criador_aluno_id: null, criador_orientador_id: { not: null } }
        : {}

    let minFollowers = 0
    let maxFollowers = 1000000

    if (followersFilter === "0-50") {
      maxFollowers = 50
    } else if (followersFilter === "50-100") {
      minFollowers = 50
      maxFollowers = 100
    } else if (followersFilter === "100+") {
      minFollowers = 100
    }

    const communities = await prisma.comunidade.findMany({
      skip: offset,
      take: itemsPerPage,
      where: {
        ...creatorCondition,
        quantidade_seguidores: {
          gte: minFollowers,
          lt: maxFollowers,
        },
      },
      select: {
        id: true,
        nome: true,
        imagem_capa: true,
        criador_aluno_id: true,
        descricao: true,
        criador_orientador_id: true,
        aluno: { select: { id: true, nome: true, caminho_foto: true } },
        orientador: { select: { id: true, nome: true } },
        quantidade_seguidores: true,
      },
    })

    const communityOverviews: ICommunityOverview[] = communities.map(
      (community) => {
        const criador = community.aluno
          ? {
              id: community.aluno.id,
              nome: community.aluno.nome,
              tipo: "Aluno" as const,
              img: community.aluno.caminho_foto ?? "/user-images/placeholder.png",
            }
          : {
              id: community.orientador?.id!,
              nome: community.orientador?.nome!,
              tipo: "Orientador" as const,
              img: "/user-images/placeholder.png"
            }

        return {
          id: community.id,
          nome: community.nome,
          descricao: community.descricao,
          imagemCapa: community.imagem_capa,
          quantidadeSeguidores: community.quantidade_seguidores ?? 0,
          criador,
        }
      }
    )

    const total = await prisma.comunidade.count({
      where: {
        ...creatorCondition,
        quantidade_seguidores: {
          gte: minFollowers,
          lt: maxFollowers,
        },
      },
    })

    return { data: communityOverviews, total }
  } catch (error) {
    handlePrismaError(error)
  }
}
