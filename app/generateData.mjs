import { faker } from "@faker-js/faker"
import { PrismaClient } from "@prisma/client"
import { subYears } from "date-fns"
import SuperFakerBrasil from "faker-brasil"

const prisma = new PrismaClient()

async function seedDatabase() {
  const fakerBrasil = new SuperFakerBrasil()

  await clearDatabase()

  // CLASSIFICAÇÕES
  const classificacoes = [
    "Projeto de Pesquisa",
    "Monografia",
    "Artigo Científico",
    "Relatório Técnico",
    "Trabalho de Conclusão de Curso",
  ]

  for (const classificacao of classificacoes) {
    await prisma.tcc_classificacao.create({
      data: {
        descricao: classificacao,
      },
    })
  }

  // PALAVRAS-CHAVE
  const palavrasChaveT = [
    "Inteligência Artificial",
    "Machine Learning",
    "Big Data",
    "Computação em Nuvem",
    "Internet das Coisas",
    "Segurança Cibernética",
    "Blockchain",
    "Realidade Virtual",
    "Realidade Aumentada",
    "Processamento de Linguagem Natural",
    "Computação Quântica",
    "Redes Neurais",
    "Visão Computacional",
    "5G",
    "Análise de Dados",
    "Automação",
    "Robótica",
    "Ciência de Dados",
    "DevOps",
    "Engenharia de Software",
  ]

  for (const palavra of palavrasChaveT) {
    await prisma.tcc_palavra_chave.create({
      data: { palavra },
    })
  }

  // ESTADO
  const estados = [
    "Em Avaliação",
    "Aprovado",
    "Reprovado",
    "Pendente de Revisão",
  ]
  for (const descricao of estados) {
    await prisma.tcc_estado.create({ data: { descricao } })
  }

  // TIPOS DE DOCUMENTO
  const tiposDocumento = [
    "Monografia",
    "Artigo",
    "Pôster",
    "Apresentação",
    "Relatório Parcial",
    "Outro",
  ]
  for (const descricao of tiposDocumento) {
    await prisma.tcc_tipo_documento.create({ data: { descricao } })
  }

  // ALUNOS
  for (let i = 0; i < 500; i++) {
    await prisma.aluno.create({
      data: {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        matricula: faker.number.int({ min: 1000000, max: 9999999 }).toString(),
        cpf: fakerBrasil.cpf(),
        telefone: fakerBrasil.cellPhone(),
        endereco: faker.location.streetAddress(),
        cidade: faker.location.city(),
        estado: faker.location.state(),
        data_ingresso: faker.date.past({ years: 4 }),
        data_nascimento: subYears(
          new Date(),
          faker.number.int({ min: 18, max: 25 })
        ),
        semestre_atual: faker.number.int({ min: 1, max: 10 }),
        caminho_foto: faker.image.avatar(),
      },
    })
  }

  // ORIENTADORES
  for (let i = 0; i < 30; i++) {
    await prisma.orientador.create({
      data: {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        cpf: fakerBrasil.cpf(),
        telefone: fakerBrasil.cellPhone(),
        departamento: faker.commerce.department(),
        titulo_academico: faker.helpers.arrayElement([
          "Doutor",
          "Mestre",
          "Especialista",
        ]),
      },
    })
  }

  // TURMAS
  for (let i = 0; i < 50; i++) {
    await prisma.turma.create({
      data: {
        nome: `Turma ${faker.animal.dog()}`,
      },
    })
  }

  // ASSOCIAR ALUNOS A TURMAS
  const alunos = await prisma.aluno.findMany()
  const turmas = await prisma.turma.findMany()

  for (const aluno of alunos) {
    const turmaAleatoria = turmas[Math.floor(Math.random() * turmas.length)]
    await prisma.aluno_turma.create({
      data: {
        aluno_id: aluno.id,
        turma_id: turmaAleatoria.id,
      },
    })
  }

  // TEMAS
  const temasTecnologia = [
    "Inteligência Artificial e Robótica",
    "Machine Learning e Deep Learning",
    "Big Data e Análise de Dados",
    "Computação em Nuvem e Virtualização",
    "Blockchain e Criptomoedas",
    "Cibersegurança e Privacidade de Dados",
    "Realidade Aumentada e Realidade Virtual",
    "Internet das Coisas (IoT)",
    "Redes 5G e Conectividade Avançada",
    "Ciência de Dados e Business Intelligence",
    "Automação e Indústria 4.0",
    "Computação Quântica",
    "Desenvolvimento de Software e Engenharia de Software",
    "Processamento de Linguagem Natural",
    "Computação Gráfica e Visualização de Dados",
    "Computação Verde e Sustentabilidade",
    "Veículos Autônomos e Mobilidade Inteligente",
    "Desenvolvimento de Aplicativos Móveis e IoT",
    "Arquitetura de Redes e Telecomunicações",
    "Segurança em Sistemas Distribuídos",
  ]

  for (const tema of temasTecnologia) {
    await prisma.tcc_tema.create({
      data: { descricao: tema },
    })
  }

  // TCCS E METADATA
  const temas = await prisma.tcc_tema.findMany()
  const classificacoesDB = await prisma.tcc_classificacao.findMany()
  const orientadores = await prisma.orientador.findMany()
  const estadosT = await prisma.tcc_estado.findMany()

  for (let i = 0; i < 300; i++) {
    const aluno = alunos[Math.floor(Math.random() * alunos.length)]
    const orientador =
      orientadores[Math.floor(Math.random() * orientadores.length)]
    const turma = turmas[Math.floor(Math.random() * turmas.length)]
    const tema = temas[Math.floor(Math.random() * temas.length)]
    const classificacao =
      classificacoesDB[Math.floor(Math.random() * classificacoesDB.length)]
    const estadoAleatorio =
      estadosT[Math.floor(Math.random() * estadosT.length)]

    const tccMetadata = await prisma.tcc_metadata.create({
      data: {
        aluno_id: aluno.id,
        orientador_id: orientador.id,
        turma_id: turma.id,
        tema_id: tema.id,
        classificacao_id: classificacao.id,
      },
    })

    await prisma.tcc.create({
      data: {
        titulo: faker.lorem.sentence(),
        tcc_metadata: { connect: { id: tccMetadata.id } },
        tcc_estado: { connect: { id: estadoAleatorio.id } },
      },
    })
  }

  // TCC_DOCUMENTOS
  const tiposDocumentoT = await prisma.tcc_tipo_documento.findMany()
  const tipoDocumentoAleatorio =
    tiposDocumentoT[Math.floor(Math.random() * tiposDocumentoT.length)]

  const tccs = await prisma.tcc.findMany()
  for (const tcc of tccs) {
    await prisma.tcc_documento.create({
      data: {
        tcc_id: tcc.id,
        tipo_documento_id: tipoDocumentoAleatorio.id,
        nome_documento: `${tcc.titulo}.pdf`,
        caminho_arquivo: `/documents/tcc-doc.pdf`,
        formato_documento: "pdf",
        data_envio: faker.date.past({ years: 1 }),
        tamanho_arquivo: faker.number.int({ min: 500, max: 2000 }),
      },
    })
  }

  // TCC_PALAVRA_CHAVE_ASSOCIACAO
  const palavrasChave = await prisma.tcc_palavra_chave.findMany()
  for (const tcc of tccs) {
    const numPalavrasChave = faker.number.int({ min: 1, max: 3 })
    const palavrasAssociadas = faker.helpers.arrayElements(
      palavrasChave,
      numPalavrasChave
    )
    for (const palavra of palavrasAssociadas) {
      await prisma.tcc_palavra_chave_associacao.create({
        data: {
          tcc_id: tcc.id,
          palavra_id: palavra.id,
        },
      })
    }
  }

  // TCC_TEMA_ASSOCIACAO
  for (const tcc of tccs) {
    const numTemas = faker.number.int({ min: 1, max: 2 })
    const temasAssociados = faker.helpers.arrayElements(temas, numTemas)
    for (const tema of temasAssociados) {
      await prisma.tcc_tema_associacao.create({
        data: {
          tcc_id: tcc.id,
          tema_id: tema.id,
        },
      })
    }
  }

  // TCC_BIBLIOGRAFIA
  for (const tcc of tccs) {
    const numReferencias = faker.number.int({ min: 1, max: 5 })
    for (let i = 0; i < numReferencias; i++) {
      await prisma.tcc_bibliografia.create({
        data: {
          tcc_id: tcc.id,
          referencia: faker.lorem.sentence(),
        },
      })
    }
  }

  // TCC_RELATORIO_PROGRESSO E TCC_RELATORIO_PROGRESSO_ARQUIVO
  for (const tcc of tccs) {
    const numRelatorios = faker.number.int({ min: 1, max: 3 })
    for (let i = 0; i < numRelatorios; i++) {
      const relatorio = await prisma.tcc_relatorio_progresso.create({
        data: {
          tcc_id: tcc.id,
          data_entrega: faker.date.past({ years: 1 }),
          descricao: faker.lorem.paragraph(),
        },
      })

      if (relatorio) {
        await prisma.tcc_relatorio_progresso_arquivo.create({
          data: {
            relatorio_id: relatorio.id,
            nome_arquivo: `${tcc.titulo}-relatorio-${i + 1}.pdf`,
            caminho_arquivo: `/documents/${tcc.titulo}-relatorio-${i + 1}.pdf`,
            formato_documento: "pdf",
            tamanho_arquivo: faker.number.int({ min: 500, max: 2000 }),
          },
        })
      }
    }
  }

  for (const tcc of tccs) {
    const numAvaliacoes = Math.floor(Math.random() * 4)

    for (let i = 0; i < numAvaliacoes; i++) {
      const orientadorAleatorio =
        orientadores[Math.floor(Math.random() * orientadores.length)]

      await prisma.tcc_avaliacao.create({
        data: {
          tcc_id: tcc.id,
          orientador_id: orientadorAleatorio.id,
          data_avaliacao: faker.date.past({ years: 1 }),
          descricao: `Avaliação ${i + 1} do TCC sobre ${tcc.titulo}`,
          nota: faker.number.float({ min: 5, max: 10, precision: 0.1 }),
          numero_avaliacao: i + 1,
        },
      })
    }
  }

  updateAllTccStates()
}

seedDatabase()
  .then(() => {
    console.log("Database seeded successfully!")
    prisma.$disconnect()
  })
  .catch((error) => {
    console.error("Error seeding database:", error)
    prisma.$disconnect()
  })

async function clearDatabase() {
  // Limpeza de dados
  // Limpeza das tabelas respeitando as restrições de chave estrangeira
  await prisma.tcc_estado_historico.deleteMany()
  await prisma.tcc_nota_final.deleteMany()
  await prisma.tcc_avaliacao.deleteMany()
  await prisma.tcc_bibliografia.deleteMany()
  await prisma.tcc_documento.deleteMany()
  await prisma.tcc_palavra_chave_associacao.deleteMany()
  await prisma.tcc_tema_associacao.deleteMany()
  await prisma.tcc_relatorio_progresso_arquivo.deleteMany()
  await prisma.tcc_relatorio_progresso.deleteMany()

  // Tabelas com dependência direta de `tcc_metadata`
  await prisma.tcc.deleteMany()
  await prisma.tcc_metadata.deleteMany()

  await prisma.aluno_turma.deleteMany()
  await prisma.aluno.deleteMany()
  await prisma.orientador.deleteMany()
  await prisma.turma.deleteMany()
  await prisma.tcc_tema.deleteMany()
  await prisma.tcc_classificacao.deleteMany()
  await prisma.tcc_palavra_chave.deleteMany()
  await prisma.tcc_estado.deleteMany()
  await prisma.tcc_tipo_documento.deleteMany()
}

async function updateAllTccStates() {
  try {
    const tccs = await prisma.tcc.findMany()
    const orientadores = await prisma.orientador.findMany()

    const estadosValidos = await prisma.tcc_estado.findMany()
    const statusAprovado = estadosValidos.find(
      (estado) => estado.descricao === "Aprovado"
    )?.id
    const statusReprovado = estadosValidos.find(
      (estado) => estado.descricao === "Reprovado"
    )?.id
    const statusEmAvaliacao = estadosValidos.find(
      (estado) => estado.descricao === "Em Avaliação"
    )?.id

    for (const tcc of tccs) {
      const orientadorAleatorio =
        orientadores[Math.floor(Math.random() * orientadores.length)]
      const qtdAvaliacoes = await prisma.tcc_avaliacao.count({
        where: { tcc_id: tcc.id },
      })

      let novoEstado = statusEmAvaliacao
      let notaFinal = null

      if (qtdAvaliacoes === 3) {
        const mediaNotas = await prisma.tcc_avaliacao.aggregate({
          _avg: { nota: true },
          where: { tcc_id: tcc.id },
        })

        notaFinal = Number(mediaNotas._avg.nota) ?? 0
        novoEstado = notaFinal >= 6.0 ? statusAprovado : statusReprovado

        const from = new Date(new Date().getFullYear(), 0, 1)
        const to = new Date()
        const dataCalculo = faker.date.between({ from, to })

        // Verifica a existência da nota final com findFirst
        const notaExistente = await prisma.tcc_nota_final.findFirst({
          where: { tcc_id: tcc.id },
        })

        if (notaExistente) {
          await prisma.tcc_nota_final.update({
            where: { id: notaExistente.id },
            data: { nota_final: notaFinal, data_calculo: dataCalculo },
          })
        } else {
          await prisma.tcc_nota_final.create({
            data: {
              tcc_id: tcc.id,
              nota_final: notaFinal,
              data_calculo: dataCalculo,
            },
          })
        }
      }

      await prisma.tcc.update({
        where: { id: tcc.id },
        data: { status: novoEstado },
      })

      await prisma.tcc_estado_historico.create({
        data: {
          tcc_id: tcc.id,
          status: novoEstado,
          data_status: new Date(),
          responsavel_orientador_id: orientadorAleatorio.id,
        },
      })
    }

    console.log("Estados de todos os TCCs atualizados com sucesso.")
  } catch (error) {
    console.log("Erro ao atualizar os estados:", error)
  }
}
