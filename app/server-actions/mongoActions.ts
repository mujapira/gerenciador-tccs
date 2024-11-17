"use server"
import prisma from "../lib/prisma"
import { IOccurrencesChartData } from "../models/mongoModels"
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
    const tcc = tccs.find((tcc) => tcc.aluno.id.id === aluno.id)
    return {
      ...aluno,
      tcc,
    }
  })
}

// id: student.id,
// nome: data.nome,
// email: data.email,
// matricula: generateMatricula(),
// cpf: data.cpf,
// telefone: data.telefone,
// endereco: data.endereco,
// cidade: data.cidade,
// estado: data.estado,
// data_ingresso: new Date(Date.now()),
// data_nascimento: new Date(data.data_nascimento),
// semestre_atual: 1,
// caminho_foto: caminho,

export interface IUpdateStudentFormData {
  data: {
    nome: string
    email: string
    matricula: string
    cpf: string
    telefone: string
    endereco: string
    cidade: string
    estado: string
    data_nascimento: Date
    semestre_atual: number
    caminho_foto: string
  }
  id: string
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

export interface ICreateStudentFormData {
  nome: string
  email: string
  matricula: string
  cpf: string
  telefone: string
  endereco: string
  cidade: string
  estado: string
  data_nascimento: Date
  semestre_atual: number
  caminho_foto: string
  turma_id: string
  turma_nome: string
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
  return await prisma.turma.findMany()
}

export async function getAllOrientadores() {
  return await prisma.orientador.findMany()
}

export async function getAllComunidades() {
  return await prisma.comunidade.findMany()
}

export async function getAllTccs() {
  return await prisma.tcc.findMany({})
}

export async function getTccDetails(tccId: string) {
  return await prisma.tcc.findUnique({
    where: { id: tccId },
    include: {
      metadata: true,
      avaliacoes: true,
      documentos: true,
      relatorios_progresso: true,
      nota_final: true,
      palavras_chave: true,
    },
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

// Retorna dados para o gráfico de classificações de TCC
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

// Retorna dados para o gráfico de notas finais de TCC
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

// Retorna dados para o gráfico de palavras-chave de TCC
export async function getTccKeywordsChartData() {
  const result = await prisma.tcc.aggregateRaw({
    pipeline: [
      {
        $unwind: "$palavras_chave", // Desaninha as palavras-chave
      },
      {
        $group: {
          _id: "$palavras_chave", // Agrupa por palavra-chave
          occurrences: { $sum: 1 }, // Conta as ocorrências
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id", // Palavra-chave
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

// Retorna dados para o gráfico de temas de TCC
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
