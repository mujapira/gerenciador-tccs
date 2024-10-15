import prisma from "../lib/prisma"

export async function Alunos() {
  const alunos = await prisma.aluno.findMany()

  return (
    <main className="flex  w-full h-full justify-center flex-col gap-8 items-center min-h-[calc(100vh-68px)]">
      <h1>Alunos</h1>
      <ul>
        {alunos.map((aluno) => (
          <li key={aluno.id}>{aluno.nome}</li>
        ))}
      </ul>
    </main>
  )
}
