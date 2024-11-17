import { faker } from "@faker-js/faker"
import SuperFakerBrasil from "faker-brasil"
import { MongoClient, ObjectId, Double } from "mongodb"

const mongoUrl = "mongodb+srv://malmasmello2:SENHA@gerenciador.rf7b5.mongodb.net/gerenciador?retryWrites=true&w=majority&appName=gerenciador"
const dbName = "gerenciador"
const fakerBrasil = new SuperFakerBrasil()

async function populateDatabase() {
  const client = new MongoClient(mongoUrl)

  const generateBrCellNumber = () => {
    // gere 11 números aleatórios
    const numbers = Array.from({ length: 11 }, () =>
      Math.floor(Math.random() * 10)
    )
    return numbers.join("")
  }

  try {
    await client.connect()
    console.log("Conectado ao MongoDB")
    const db = client.db(dbName)

    // CLASSIFICAÇÕES
    const classificacoes = [
      "Projeto de Pesquisa",
      "Monografia",
      "Artigo Científico",
      "Relatório Técnico",
      "Trabalho de Conclusão de Curso",
    ].map((descricao) => ({ descricao }))
    const classificacoesIds = await db
      .collection("tcc_classificacao")
      .insertMany(classificacoes)
      .then((res) => Object.values(res.insertedIds))

    // TIPOS DE DOCUMENTO
    const tiposDocumento = [
      "Monografia",
      "Artigo",
      "Pôster",
      "Apresentação",
      "Relatório Parcial",
      "Outro",
    ].map((descricao) => ({ descricao }))

    await db.collection("tcc_tipo_documento").insertMany(tiposDocumento)

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
    ].map((descricao) => ({ descricao }))
    const temasIds = await db
      .collection("tcc_tema")
      .insertMany(temasTecnologia)
      .then((res) => Object.values(res.insertedIds))

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
    ].map((palavra) => ({ palavra }))
    await db.collection("tcc_palavra_chave").insertMany(palavrasChaveT)

    // ESTADOS
    const estados = [
      "Em Avaliação",
      "Aprovado",
      "Reprovado",
      "Pendente de Revisão",
    ].map((descricao) => ({ descricao }))
    await db.collection("tcc_estado").insertMany(estados)

    // TURMAS
    const turmas = Array.from({ length: 5 }, (_, i) => ({
      nome: `Turma ${faker.animal.dog()}`,
      alunos: [], // Será preenchido após a inserção dos alunos
    }))

    // Insere as turmas no banco (sem os alunos ainda)
    const turmaIds = await db
      .collection("turma")
      .insertMany(turmas)
      .then((res) => Object.values(res.insertedIds))

    // ALUNOS
    const alunos = Array.from({ length: 50 }, (_, index) => {
      const turmaAleatoria = faker.helpers.arrayElement(turmaIds)
      return {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        matricula: faker.number.int({ min: 1000000, max: 9999999 }).toString(),
        cpf: fakerBrasil.cpf(),
        telefone: generateBrCellNumber(),
        endereco: faker.location.streetAddress(),
        cidade: faker.location.city(),
        estado: faker.location.state(),
        data_ingresso: faker.date.past(4),
        data_nascimento: faker.date.birthdate({
          min: 18,
          max: 25,
          mode: "age",
        }),
        semestre_atual: faker.number.int({ min: 1, max: 10 }),
        caminho_foto: faker.image.avatar(),
        turma_id: turmaAleatoria, // Associa o aluno a uma turma
        turma_nome: turmas.find((turma) => turma._id.equals(turmaAleatoria))
          .nome,
      }
    })

    // Insere os alunos no banco
    const alunoIds = await db
      .collection("aluno")
      .insertMany(alunos)
      .then((res) => {
        // Mapeia os alunos com seus respectivos IDs gerados
        return alunos.map((aluno, index) => ({
          ...aluno,
          _id: res.insertedIds[index],
        }))
      })

    // Atualiza as turmas para incluir os alunos
    await Promise.all(
      turmaIds.map(async (turmaId) => {
        const alunosNaTurma = alunoIds
          .filter((aluno) => aluno.turma_id.equals(turmaId))
          .map((aluno) => ({
            _id: aluno._id,
            nome: aluno.nome,
          }))

        await db.collection("turma").updateOne(
          { _id: turmaId },
          {
            $set: {
              alunos: alunosNaTurma,
            },
          }
        )
      })
    )

    // ORIENTADORES
    const orientadores = Array.from({ length: 10 }, () => ({
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      cpf: fakerBrasil.cpf(),
      telefone: generateBrCellNumber(),
      departamento: faker.commerce.department(),
      titulo_academico: faker.helpers.arrayElement([
        "Doutor",
        "Mestre",
        "Especialista",
      ]),
    }))

    const orientadorIds = await db
      .collection("orientador")
      .insertMany(orientadores)
      .then((res) => Object.values(res.insertedIds))

    console.log("Alunos, turmas e orientadores criados com sucesso!")

    // CRIAR COMUNIDADES
    const comunidades = Array.from({ length: 50 }, () => {
      const isAlunoCreator = Math.random() > 0.5

      // Seleciona o _id do criador (aluno ou orientador)
      const criador = isAlunoCreator
        ? {
            tipo: "aluno",
            id: faker.helpers.arrayElement(
              alunoIds.map((aluno) => {
                return aluno._id
              })
            ),
          }
        : { tipo: "orientador", id: faker.helpers.arrayElement(orientadorIds) }

      // Cria posts com autor consistente
      const posts = Array.from(
        { length: faker.number.int({ min: 3, max: 10 }) },
        () => {
          const isAlunoAutor = Math.random() > 0.5
          const autorId = isAlunoAutor
            ? faker.helpers.arrayElement(
                alunoIds.map((aluno) => {
                  return aluno._id
                })
              ) // Somente o _id
            : faker.helpers.arrayElement(orientadorIds) // Somente o _id
          return {
            autor: {
              tipo: isAlunoAutor ? "aluno" : "orientador",
              id: autorId,
            },
            conteudo: faker.lorem.paragraph(),
            data_postagem: faker.date.past(),
          }
        }
      )

      // Cria seguidores com id consistente
      const seguidores = Array.from(
        { length: faker.number.int({ min: 1, max: 400 }) },
        () => {
          const isAlunoSeguidor = Math.random() > 0.5
          const seguidorId = isAlunoSeguidor
            ? faker.helpers.arrayElement(
                alunoIds.map((aluno) => {
                  return aluno._id
                })
              ) // Somente o _id
            : faker.helpers.arrayElement(orientadorIds) // Somente o _id
          return {
            seguidor: {
              tipo: isAlunoSeguidor ? "aluno" : "orientador",
              id: seguidorId,
            },
            data_seguimento: faker.date.past(),
          }
        }
      )

      return {
        nome: faker.company.name(),
        descricao: faker.lorem.paragraph(),
        imagem_capa: "/community-images/community-placeholder.png",
        data_criacao: faker.date.past(),
        criador, // Contém apenas tipo e id
        posts,
        seguidores,
      }
    })
    await db.collection("comunidade").insertMany(comunidades)

    const alunoMap = alunos.map((aluno, index) => ({
      ...aluno,
      _id: alunoIds[index], // Associa o ID gerado ao objeto original
    }))

    const orientadorMap = orientadores.map((orientador, index) => ({
      ...orientador,
      _id: orientadorIds[index], // Associa o ID gerado ao objeto original
    }))

    const tccs = Array.from({ length: 30 }, () => {
      const aluno = faker.helpers.arrayElement(alunoMap)
      const orientador = faker.helpers.arrayElement(orientadorMap)
      const tema = faker.helpers.arrayElement(temasIds)
      const classificacao = faker.helpers.arrayElement(classificacoesIds)

      // Gera até 3 avaliações para cada TCC
      const avaliacoes = Array.from(
        { length: faker.number.int({ min: 1, max: 3 }) },
        (_, i) => ({
          numero: i + 1,
          orientador: {
            _id: faker.helpers.arrayElement(orientadorIds),
            nome: faker.helpers.arrayElement(orientadorMap).nome,
          },
          data_avaliacao: faker.date.past(),
          descricao: faker.lorem.sentence(),
          nota: new Double(
            faker.number.float({ min: 5, max: 10, precision: 0.1 })
          ),
        })
      )

      // Calcula a nota final como média das notas, ou deixa como `null` se não houver avaliações
      const notaFinal =
        avaliacoes.length > 0
          ? new Double(
              avaliacoes.reduce((sum, { nota }) => sum + nota.valueOf(), 0) /
                avaliacoes.length
            )
          : null

      return {
        titulo: faker.lorem.words(5),
        status: faker.helpers.arrayElement(estados).descricao,
        aluno: {
          _id: aluno._id,
          nome: aluno.nome,
        },
        orientador: {
          _id: orientador._id,
          nome: orientador.nome,
        },
        tema: {
          _id: tema,
          descricao: temasTecnologia.find((te) => te._id.equals(tema))
            .descricao,
        },
        classificacao: {
          _id: classificacao,
          descricao: classificacoes.find((cl) => cl._id.equals(classificacao))
            .descricao,
        },
        documentos: Array.from({ length: 3 }, () => ({
          tipo: faker.helpers.arrayElement(tiposDocumento).descricao,
          nome: `${faker.lorem.word()}.pdf`,
          caminho: "/path/to/document.pdf",
          formato: "pdf",
          data_envio: faker.date.past(),
          tamanho: faker.number.int({ min: 500, max: 2000 }),
        })),
        palavras_chave: faker.helpers.arrayElements(
          palavrasChaveT.map((palavra) => palavra),
          faker.number.int({ min: 1, max: 5 })
        ),
        avaliacoes: avaliacoes,
        notaFinal: notaFinal,
      }
    })

    await db.collection("tcc").insertMany(tccs)

    console.log("Banco de dados populado com sucesso!")
  } finally {
    await client.close()
  }
}

populateDatabase().catch(console.error)
