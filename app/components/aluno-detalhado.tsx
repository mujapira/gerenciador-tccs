import prisma from "../lib/prisma"

interface AlunoProps {
  id: number
}

export async function AlunoDetalhado({ id }: AlunoProps) {
  const alunoComTurma = await prisma.aluno.findUnique({
    where: {
      id: id,
    },
    include: {
      aluno_turma: {
        include: {
          turma: true,
        },
      },
    },
  })

  return (
    <div>
      <span>{alunoComTurma?.nome}</span>
      <ul>
        {alunoComTurma?.aluno_turma.map((aluno_turma) => (
          <li key={aluno_turma.turma_id}>
            <span>{aluno_turma.turma.nome}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
