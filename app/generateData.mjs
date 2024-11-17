import { faker } from "@faker-js/faker"
import SuperFakerBrasil from "faker-brasil"
import { MongoClient, ObjectId, Double } from "mongodb"

const mongoUrl = "mongodb://localhost:27017"
const dbName = "gerenciador"
const fakerBrasil = new SuperFakerBrasil()

async function populateDatabase() {
  const client = new MongoClient(mongoUrl)

  try {
    await client.connect()
    console.log("Conectado ao MongoDB")
    const db = client.db(dbName)

    // 1. Coleção de Alunos e Orientadores
    const alunos = Array.from({ length: 50 }, () => ({
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      matricula: faker.number.int({ min: 1000000, max: 9999999 }).toString(),
      cpf: fakerBrasil.cpf(),
      telefone: fakerBrasil.cellPhone(),
      endereco: faker.location.streetAddress(),
      cidade: faker.location.city(),
      estado: faker.location.state(),
      data_ingresso: faker.date.past(4),
      data_nascimento: faker.date.birthdate({ min: 18, max: 25, mode: "age" }),
      semestre_atual: faker.number.int({ min: 1, max: 10 }),
      caminho_foto: faker.image.avatar(),
    }))

    const orientadores = Array.from({ length: 10 }, () => ({
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
    }))

    const alunoIds = await db
      .collection("aluno")
      .insertMany(alunos)
      .then((res) => Object.values(res.insertedIds))
    const orientadorIds = await db
      .collection("orientador")
      .insertMany(orientadores)
      .then((res) => Object.values(res.insertedIds))

    console.log("Alunos e Orientadores criados.")

    // 2. Coleção de Comunidades (com posts e seguidores)
    const comunidades = Array.from({ length: 50 }, (_, i) => {
      const isAlunoCreator = Math.random() > 0.5
      const criador = isAlunoCreator
        ? { tipo: "aluno", id: faker.helpers.arrayElement(alunoIds) }
        : { tipo: "orientador", id: faker.helpers.arrayElement(orientadorIds) }

      const posts = Array.from(
        { length: faker.number.int({ min: 3, max: 10 }) },
        () => {
          const isAlunoAutor = Math.random() > 0.5
          return {
            autor: isAlunoAutor
              ? { tipo: "aluno", id: faker.helpers.arrayElement(alunoIds) }
              : {
                  tipo: "orientador",
                  id: faker.helpers.arrayElement(orientadorIds),
                },
            conteudo: faker.lorem.paragraph(),
            data_postagem: faker.date.past(),
          }
        }
      )

      const seguidores = Array.from(
        { length: faker.number.int({ min: 1, max: 400 }) },
        () => {
          const isAlunoSeguidor = Math.random() > 0.5
          return {
            seguidor: isAlunoSeguidor
              ? { tipo: "aluno", id: faker.helpers.arrayElement(alunoIds) }
              : {
                  tipo: "orientador",
                  id: faker.helpers.arrayElement(orientadorIds),
                },
            data_seguimento: faker.date.past(),
          }
        }
      )

      return {
        nome: faker.company.name(),
        descricao: faker.lorem.paragraph(),
        imagem_capa:
          i < 15
            ? `/community-images/community-${i + 1}.jpg`
            : "/community-images/community-placeholder.png",
        data_criacao: faker.date.past(),
        criador,
        posts,
        seguidores,
      }
    })

    await db.collection("comunidade").insertMany(comunidades)
    console.log("Comunidades com posts e seguidores embutidos criadas.")

    // 3. Coleções Auxiliares (Classificações, Tipos de Documento, Temas, Estados, Palavras-Chave)
    const classificacoes = [
      "Projeto de Pesquisa",
      "Monografia",
      "Artigo Científico",
      "Relatório Técnico",
      "Trabalho de Conclusão de Curso",
    ].map((descricao) => ({ descricao }))
    await db.collection("tcc_classificacao").insertMany(classificacoes)

    const tiposDocumento = [
      "Monografia",
      "Artigo",
      "Pôster",
      "Apresentação",
      "Relatório Parcial",
      "Outro",
    ].map((descricao) => ({ descricao }))
    await db.collection("tcc_tipo_documento").insertMany(tiposDocumento)

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
    const temaIds = await db
      .collection("tcc_tema")
      .insertMany(temasTecnologia)
      .then((res) => Object.values(res.insertedIds))

    const estados = [
      "Em Avaliação",
      "Aprovado",
      "Reprovado",
      "Pendente de Revisão",
    ].map((descricao) => ({ descricao }))
    await db.collection("tcc_estado").insertMany(estados)

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

    console.log("Coleções auxiliares de TCC criadas e populadas.")

    // 4. Coleção de TCCs (com metadata, status, relatórios, avaliações, bibliografias, tema, palavras-chave e nota final)
    const tccs = Array.from({ length: 30 }, () => {
      const aluno = faker.helpers.arrayElement(alunoIds)
      const orientador = faker.helpers.arrayElement(orientadorIds)
      const tema = faker.helpers.arrayElement(temaIds)

      return {
        titulo: faker.lorem.words(5),
        status: faker.helpers.arrayElement(estados).descricao,
        metadata: {
          aluno_id: aluno,
          orientador_id: orientador,
          tema_id: tema,
          classificacao: faker.helpers.arrayElement(classificacoes).descricao,
        },
        documentos: Array.from({ length: 3 }, () => ({
          tipo: faker.helpers.arrayElement(tiposDocumento).descricao,
          nome: `${faker.lorem.word()}.pdf`,
          caminho: "/path/to/document.pdf",
          formato: "pdf",
          data_envio: faker.date.past(),
          tamanho: faker.number.int({ min: 500, max: 2000 }),
        })),
        palavras_chave: faker.helpers
          .arrayElements(palavrasChaveT, faker.number.int({ min: 1, max: 5 }))
          .map((pk) => pk.palavra),
        avaliacoes: Array.from(
          { length: faker.number.int({ min: 1, max: 4 }) },
          (_, i) => ({
            orientador_id: orientador,
            data_avaliacao: faker.date.past(),
            descricao: `Avaliação ${i + 1}`,
            nota: new Double(
              faker.number.float({ min: 5, max: 10, precision: 0.1 })
            ),
            numero_avaliacao: i + 1,
          })
        ),
        historico_estado: [
          {
            status: faker.helpers.arrayElement(estados).descricao,
            data_status: faker.date.past(),
            responsavel_orientador_id: orientador,
          },
        ],
        bibliografias: Array.from(
          { length: faker.number.int({ min: 1, max: 5 }) },
          () => ({
            referencia: faker.lorem.sentence(),
          })
        ),
        relatorios_progresso: Array.from(
          { length: faker.number.int({ min: 1, max: 3 }) },
          (_, i) => ({
            data_entrega: faker.date.past(),
            descricao: `Relatório ${i + 1}`,
            arquivos: [
              {
                nome: `relatorio-${i + 1}.pdf`,
                caminho: `/documents/relatorio-${i + 1}.pdf`,
                formato: "pdf",
                tamanho: faker.number.int({ min: 500, max: 2000 }),
              },
            ],
          })
        ),
        nota_final: {
          nota: new Double(
            faker.number.float({ min: 5, max: 10, precision: 0.1 })
          ),
          data_calculo: faker.date.recent(),
        },
      }
    })

    await db.collection("tcc").insertMany(tccs)
    console.log("Coleção de TCCs criada e populada com dados completos.")
  } finally {
    await client.close()
  }
}

populateDatabase().catch(console.error)
