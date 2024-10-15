import prisma from "../lib/prisma"

export async function Alunos() {
  const alunos = await prisma.aluno.findMany()

  return (
    <div>
      <h1>Alunos</h1>
      <ul>
        {alunos.map((aluno) => (
          <li key={aluno.id}>{aluno.nome}</li>
        ))}
      </ul>
    </div>
  )
}
