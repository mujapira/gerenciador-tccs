import { faker } from "@faker-js/faker"
import { PrismaClient } from "@prisma/client"
import { subYears } from "date-fns"
import SuperFakerBrasil from "faker-brasil"

const prisma = new PrismaClient()

async function seedDatabase() {
  const fakerBrasil = new SuperFakerBrasil()

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

  for (let i = 0; i < 50; i++) {
    await prisma.turma.create({
      data: {
        nome: `Turma ${faker.animal.dog()}`,
      },
    })
  }

  for (let i = 0; i < 20; i++) {
    await prisma.tcc_tema.create({
      data: {
        descricao: faker.lorem.words(5),
      },
    })
  }

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

  // 7. Criar TCCs com metadata
  for (let i = 0; i < 300; i++) {
    const aluno = await prisma.aluno.findFirst({ orderBy: { id: "desc" } })
    const orientador = await prisma.orientador.findFirst({
      orderBy: { id: "desc" },
    })
    const turma = await prisma.turma.findFirst({ orderBy: { id: "desc" } })
    const tema = await prisma.tcc_tema.findFirst({ orderBy: { id: "desc" } })
    const classificacao = await prisma.tcc_classificacao.findFirst({
      orderBy: { id: "desc" },
    })

    if (aluno && orientador && turma && tema && classificacao) {
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
          metadata_id: tccMetadata.id,
          status: faker.helpers.arrayElement([1, 2, 3, 4]), // Status aleatório
        },
      })
    }
  }

  // 8. Criar documentos para os TCCs
  const tccs = await prisma.tcc.findMany()
  for (const tcc of tccs) {
    await prisma.tcc_documento.create({
      data: {
        tcc_id: tcc.id,
        tipo_documento_id: 1, // Suponha que tipo 1 seja o tipo padrão
        nome_documento: `${tcc.titulo}.pdf`,
        caminho_arquivo: `/documents/tcc-doc.pdf`,
        formato_documento: "pdf",
        data_envio: faker.date.past({ years: 1 }),
        tamanho_arquivo: faker.number.int({ min: 500, max: 2000 }),
      },
    })
  }
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
