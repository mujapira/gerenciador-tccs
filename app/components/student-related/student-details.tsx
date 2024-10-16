"use client"

import { useEffect, useState } from "react"
import { GetStudent } from "../../server-actions/getStudent"

interface GetStudentProps {
  id: number
}

export function StudentDetails({ id }: GetStudentProps) {
  const [student, setStudent] = useState<any>()

  const handleGetStudents = async () => {
    const response = await GetStudent(id)

    if (response) {
      setStudent(response)
    }
  }

  useEffect(() => {
    handleGetStudents()
  }, [])

  return (
    <div>
      <span>{student?.nome}</span>
      <ul>
        {student?.aluno_turma.map((aluno_turma: any) => (
          <li key={aluno_turma.turma_id}>
            <span>{aluno_turma.turma.nome}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
