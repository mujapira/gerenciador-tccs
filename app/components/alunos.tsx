import { Fragment } from "react"
import prisma from "../lib/prisma"
import Link from "next/link"

export async function Alunos() {
  const alunos = await prisma.aluno.findMany()

  return (
    <Fragment>
      <ul className="flex flex-col gap-2">
        {alunos.map((aluno) => (
          <Link href={`/alunos/${aluno.id}`} key={aluno.id}>
            <span>{aluno.nome}</span>
          </Link>
        ))}
      </ul>
    </Fragment>
  )
}
