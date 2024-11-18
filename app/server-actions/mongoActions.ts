"use server"

import prisma from "../lib/prisma"
import {
  IClass,
  ICommunity,
  ICommunityFromBase,
  ICreateStudentFormData,
  ICreateTeacherFormData,
  IOccurrencesChartData,
  IStudent,
  IUpdateStudentFormData,
  IUpdateTeacherFormData,
} from "../models/mongoModels"
import { handlePrismaError } from "../utils/handle-error"

export async function getAllStudents() {
  return await prisma.aluno.findMany()
}

export async function getStudent(studentId: string) {
  return await prisma.aluno.findUnique({
    where: { id: studentId },
  })
}

export async function getAllStudentsWithTcc() {
  const alunos = await prisma.aluno.findMany({})
  const tccs = await prisma.tcc.findMany({})

  return alunos.map((aluno) => {
    const tcc = tccs.find((tcc) => tcc.aluno.id === aluno.id)
    return {
      ...aluno,
      tcc,
    }
  })
}

export async function updateStudent({ data, id }: IUpdateStudentFormData) {
  try {
    await prisma.aluno.update({
      where: { id: id },
      data: {
        ...data,
      },
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

export async function createStudent(data: ICreateStudentFormData) {
  try {
    await prisma.aluno.create({
      data: {
        ...data,
        data_ingresso: new Date(Date.now()),
      },
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

export async function getClasses() {
  const response = await prisma.turma.findMany({
    include: {
      alunos: {
        include: {
          aluno: true,
        },
      },
    },
  })
  const classes: IClass[] = response.map((turma) => ({
    id: turma.id,
    nome: turma.nome,
    alunos: turma.alunos.map((relacaoAluno) => ({
      id: relacaoAluno.aluno.id,
      nome: relacaoAluno.aluno.nome,
      email: relacaoAluno.aluno.email,
      matricula: relacaoAluno.aluno.matricula,
      data_ingresso: relacaoAluno.aluno.data_ingresso,
      data_nascimento: relacaoAluno.aluno.data_nascimento,
      endereco: relacaoAluno.aluno.endereco,
      cidade: relacaoAluno.aluno.cidade,
      estado: relacaoAluno.aluno.estado,
      cpf: relacaoAluno.aluno.cpf,
      caminho_foto: relacaoAluno.aluno.caminho_foto,
      telefone: relacaoAluno.aluno.telefone,
      turma_id: relacaoAluno.aluno.turma_id,
      turma_nome: relacaoAluno.aluno.turma_nome,
      semestre_atual: relacaoAluno.aluno.semestre_atual,
    })),
  }))

  return classes
}

export async function updateClassStudents(
  classId: string,
  students: IStudent[]
) {
  try {
    const oldTurma = await prisma.turma.findUnique({
      where: { id: classId },
      include: {
        alunos: {
          include: {
            aluno: true,
          },
        },
      },
    })

    await prisma.turma.update({
      where: { id: classId },
      data: {
        alunos: {
          set: students.map((student) => ({
            aluno: {
              id: student.id,
              nome: student.nome,
              email: student.email,
              matricula: student.matricula,
              data_ingresso: student.data_ingresso,
              data_nascimento: student.data_nascimento,
              endereco: student.endereco,
              cidade: student.cidade,
              estado: student.estado,
              cpf: student.cpf,
              caminho_foto: student.caminho_foto,
              telefone: student.telefone,
              turma_id: student.turma_id,
              turma_nome: student.turma_nome,
              semestre_atual: student.semestre_atual,
            },
          })),
        },
      },
    })

    const oldStudents = oldTurma?.alunos.map(
      (relacaoAluno) => relacaoAluno.aluno
    )
    const removedStudents = oldStudents?.filter(
      (oldStudent) => !students.some((student) => student.id === oldStudent.id)
    )
    const addedStudents = students.filter(
      (student) =>
        !oldStudents?.some((oldStudent) => oldStudent.id === student.id)
    )

    console.log(removedStudents)
    console.log(addedStudents)

    removedStudents?.forEach(async (student) => {
      await prisma.aluno.update({
        where: { id: student.id },
        data: {
          turma_id: undefined,
          turma_nome: undefined,
        },
      })
    })

    addedStudents.forEach(async (student) => {
      await prisma.aluno.update({
        where: { id: student.id },
        data: {
          turma_id: classId,
          turma_nome: oldTurma?.nome,
        },
      })
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

export async function createClass(data: string, students: IStudent[]) {
  try {
    const turma = await prisma.turma.create({
      data: {
        nome: data,
      },
    })

    await updateClassStudents(turma.id, students)
  } catch (error) {
    handlePrismaError(error)
  }
}

export async function getAllOrientadores() {
  return await prisma.orientador.findMany()
}

export async function getOrientador(orientadorId: string) {
  return await prisma.orientador.findUnique({
    where: { id: orientadorId },
  })
}

export async function getOrientadorTccs(orientadorId: string) {
  const tccs = await prisma.tcc.findMany()
  
  return tccs.filter((tcc) => tcc.orientador.id === orientadorId)
}

export async function createOrientador(data: ICreateTeacherFormData) {
  try {
    await prisma.orientador.create({
      data: {
        ...data,
      },
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

export async function updateOrientador({ data, id }: IUpdateTeacherFormData) {
  if (data.caminho_foto && !data.caminho_foto.startsWith("/")) {
    data.caminho_foto = `/${data.caminho_foto}`
  }

  try {
    await prisma.orientador.update({
      where: { id: id },
      data: {
        ...data,
      },
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

interface GetAllComunidadesParams {
  page?: number
  itemsPerPage?: number
  creatorFilter?: string
  followersFilter?: string
}

export async function getAllComunidades({
  page = 1,
  itemsPerPage = 12,
  creatorFilter = "Todos",
  followersFilter = "Todos",
}: GetAllComunidadesParams): Promise<{
  data: ICommunityFromBase[]
  total: number
}> {
  const comunidades = await prisma.comunidade.findMany()
  comunidades.forEach(async (comunidade, index) => {
    if (index < 15) {
      await prisma.comunidade.update({
        where: { id: comunidade.id },
        data: {
          imagem_capa: `/community-images/community-${index + 1}.jpg`,
        },
      })
    }
  })

  const skip = (page - 1) * itemsPerPage

  const where: any = {}

  if (creatorFilter !== "Todos") {
    where.criador = {
      tipo: creatorFilter.toLowerCase(),
    }
  }

  if (followersFilter !== "Todos") {
    const [min, max] = followersFilter.split("-").map(Number)
    where.seguidores = {
      some: {
        AND: [
          min !== undefined && { seguidoresCount: { gte: min } },
          max !== undefined && { seguidoresCount: { lte: max } },
        ].filter(Boolean),
      },
    }
  }

  const [rawData, total] = await prisma.$transaction([
    prisma.comunidade.findMany({
      skip,
      take: itemsPerPage,
      where,
      include: {
        criador: true,
        posts: true,
        seguidores: {
          include: {
            seguidor: true,
          },
        },
      },
    }),
    prisma.comunidade.count({ where }),
  ])

  const data: ICommunityFromBase[] = rawData.map((comunidade) => ({
    ...comunidade,
    seguidores: comunidade.seguidores.map((seguidor) => ({
      id: seguidor.seguidor.id,
      tipo: seguidor.seguidor.tipo,
      data_seguimento: seguidor.data_seguimento,
    })),
  }))

  return { data, total }
}

export async function getCommunity(id: string) {
  const request = await prisma.comunidade.findUnique({
    where: { id },
  })

  const students = await prisma.aluno.findMany({})
  const teachers = await prisma.orientador.findMany({})

  const seguidores = request?.seguidores.map((seguidor) => {
    const student = students.find(
      (student) => student.id === seguidor.seguidor.id
    )
    if (student) {
      return { ...seguidor, info: student }
    }

    const teacher = teachers.find(
      (teacher) => teacher.id === seguidor.seguidor.id
    )
    if (teacher) {
      return { ...seguidor, info: teacher }
    }

    return null
  })

  const posts = request?.posts.map((post) => {
    const student = students.find((student) => student.id === post.autor.id)
    if (student) {
      return { ...post, autor: { info: student, tipo: post.autor.tipo } }
    }

    const teacher = teachers.find((teacher) => teacher.id === post.autor.id)
    if (teacher) {
      return { ...post, autor: { info: teacher, tipo: post.autor.tipo } }
    }

    return null
  })

  let criador
  if (request?.criador.tipo === "aluno") {
    criador = students.find((student) => student.id === request.criador.id)
  } else {
    criador = teachers.find((teacher) => teacher.id === request?.criador.id)
  }

  return {
    ...request,
    criador: {
      info: criador,
      tipo: request?.criador.tipo,
    },
    seguidores: seguidores?.filter(Boolean),
    posts: posts?.filter(Boolean),
  } as unknown as ICommunity
}

export async function getAllKeyWords() {
  return await prisma.tcc_palavra_chave.findMany()
}

export async function getAllThemes() {
  return await prisma.tcc_tema.findMany()
}

export async function getAllClassifications() {
  return await prisma.tcc_classificacao.findMany()
}

// export interface ITcc {
//   id: string // ID único do TCC
//   titulo: string // Título do TCC
//   aluno: {
//     id: string
//     nome: string
//   } // Aluno associado
//   orientador: {
//     id: string
//     nome: string
//   } // Orientador associado
//   tema: {
//     id: string
//     descricao: string
//   } // Tema associado
//   classificacao: {
//     id: string
//     descricao: string
//   } // Classificação do TCC
//   documentos: {
//     tipo: string
//     nome: string
//     caminho: string
//     formato: string
//     data_envio: Date
//     tamanho: number
//   }[] // Lista de documentos do TCC
//   palavras_chave: {
//     id: string
//     descricao: string
//   }[]
//   avaliacoes: {
//     numero: number
//     orientador: {
//       id: string
//       nome: string
//     }
//     data_avaliacao: Date
//     descricao: string
//     nota: number
//   }[] // Avaliações do TCC
//   notaFinal: number | null // Nota final calculada
//   status: string // Status do TCC
// }

export interface ICreateTccFormData {
  titulo: string
  aluno: {
    id: string
    nome: string
  }
  tema: {
    id: string
    descricao: string
  }
  classificacao: {
    id: string
    descricao: string
  }
  orientador: {
    id: string
    nome: string
  }
  palavras_chave: {
    id: string
    palavra: string
  }[]
}

export async function createNewTcc(data: ICreateTccFormData) {
  const notaFinal = 0

  const statuses = await prisma.tcc_estado.findMany()
  if (!statuses) return

  const status = statuses.find((status) => status.descricao === "Em Avaliação")
  if (!status) return

  const aluno = await prisma.aluno.findUnique({
    where: { id: data.aluno.id },
  })
  const orientador = await prisma.orientador.findUnique({
    where: { id: data.orientador.id },
  })

  const palavrasChave = await prisma.tcc_palavra_chave.findMany()
  if (!palavrasChave) return

  // Verifica se as palavras-chave existem no banco de dados
  // para cada palabra-chave enviada no formulário encontre no banco de dados
  // a palavra-chave correspondente e adicione ao array odifical de palavras-chave

  const palavrasChaveOficiais = await Promise.all(
    data.palavras_chave.map(async (palavraChave) => {
      const palavraChaveOficial = palavrasChave.find(
        (pc) => pc.palavra === palavraChave.palavra
      )
      if (palavraChaveOficial) {
        return {
          id: palavraChaveOficial.id,
          palavra: palavraChaveOficial.palavra,
        }
      } else {
        const created = await prisma.tcc_palavra_chave.create({
          data: {
            palavra: palavraChave.palavra,
          },
        })

        return {
          id: created.id,
          palavra: created.palavra,
        }
      }
    })
  )

  if (!aluno || !orientador) return

  try {
    await prisma.tcc.create({
      data: {
        titulo: data.titulo,
        aluno: {
          ...aluno,
        },
        orientador: {
          ...orientador,
        },
        tema: {
          id: data.tema.id,
          descricao: data.tema.descricao,
        },
        classificacao: {
          id: data.classificacao.id,
          descricao: data.classificacao.descricao,
        },
        palavras_chave: palavrasChaveOficiais,
        notaFinal,
        status: {
          id: status.id,
          descricao: status.descricao,
        },
      },
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

export async function getAllTccs() {
  return await prisma.tcc.findMany({})
}

export async function getTccDetails(tccId: string) {
  return await prisma.tcc.findUnique({
    where: { id: tccId },
  })
}

export async function getComunidadeDetails(comunidadeId: string) {
  return await prisma.comunidade.findUnique({
    where: { id: comunidadeId },
    include: {
      membros: true,
      posts: true,
    },
  })
}

export async function getRelatoriosProgressoByTccId(tccId: string) {
  return await prisma.tcc.findUnique({
    where: { id: tccId },
  })
}

export async function getAvaliacoesByTccId(tccId: string) {
  return await prisma.tcc.findUnique({
    where: { id: tccId },
  })
}

export async function getTccClassificationChartData() {
  const result = await prisma.tcc.aggregateRaw({
    pipeline: [
      {
        $group: {
          _id: "$classificacao.descricao", // Agrupa pela descrição da classificação
          occurrences: { $sum: 1 }, // Conta as ocorrências
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id", // Nome da classificação
          occurrences: 1, // Total de ocorrências
        },
      },
    ],
  })

  if (Array.isArray(result)) {
    return result
      .sort((a, b) => {
        if (b.occurrences !== a.occurrences) {
          return b.occurrences - a.occurrences
        }
        return a.name.localeCompare(b.name)
      })
      .slice(0, 5) as unknown as IOccurrencesChartData[]
  }
}

export async function getTccGradesChartData() {
  const gradeOccurrences: { [key: number]: number } = {}
  for (let i = 0; i <= 10; i++) {
    gradeOccurrences[i] = 0 // Inicializa as notas de 0 a 10
  }

  const result = await prisma.tcc.aggregateRaw({
    pipeline: [
      {
        $project: {
          roundedGrade: { $round: ["$notaFinal", 0] }, // Arredonda a nota final
        },
      },
      {
        $group: {
          _id: "$roundedGrade", // Agrupa pela nota arredondada
          occurrences: { $sum: 1 }, // Conta as ocorrências
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id", // Nota final arredondada
          occurrences: 1, // Total de ocorrências
        },
      },
    ],
  })

  if (Array.isArray(result)) {
    result.forEach((item: IOccurrencesChartData) => {
      gradeOccurrences[Number(item.name)] = item.occurrences
    })

    const finalResult: IOccurrencesChartData[] = Object.entries(
      gradeOccurrences
    ).map(([name, occurrences]) => ({
      name: parseInt(name),
      occurrences: occurrences,
    }))
    return finalResult
  }

  return []
}

export async function getTccKeywordsChartData() {
  const result = await prisma.tcc.aggregateRaw({
    pipeline: [
      {
        $unwind: "$palavras_chave",
      },
      {
        $group: {
          _id: "$palavras_chave", // Agrupa por palavra-chave
          occurrences: { $sum: 1 }, // Conta as ocorrências
        },
      },
      {
        $sort: {
          occurrences: -1, // Ordena por número de ocorrências (decrescente)
          "_id.palavra": 1, // Ordena alfabeticamente por palavra
        },
      },
      {
        $limit: 5, // Limita aos top 5
      },
      {
        $project: {
          _id: 0,
          name: "$_id.palavra", // Extrai apenas a palavra para o campo "name"
          occurrences: 1, // Total de ocorrências
        },
      },
    ],
  })

  // Retorna os dados no formato correto
  return Array.isArray(result) ? (result as IOccurrencesChartData[]) : []
}

export async function getTccThemesChartData() {
  const result = await prisma.tcc.aggregateRaw({
    pipeline: [
      { $match: { "tema.descricao": { $exists: true, $ne: null } } }, // Ignora documentos inválidos
      {
        $group: {
          _id: "$tema.descricao",
          occurrences: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          occurrences: 1,
        },
      },
    ],
  })

  if (Array.isArray(result)) {
    return result
      .sort((a, b) => {
        if (b.occurrences !== a.occurrences) {
          return b.occurrences - a.occurrences
        }
        return a.name.localeCompare(b.name)
      })
      .slice(0, 5) as unknown as IOccurrencesChartData[]
  }

  return []
}
