"use client"

import { useEffect, useState } from "react"
import { GetStudentDetails } from "../../server-actions/getStudent"
import { IDetailedStudent } from "@/app/models/detailedStudentModel"

interface GetStudentProps {
  id: number
}

export function StudentDetails({ id }: GetStudentProps) {
  const [student, setStudent] = useState<IDetailedStudent>()

  const handleGetStudents = async () => {
    const response = await GetStudentDetails(id)

    if (response) {
      setStudent(response as IDetailedStudent)
    }
  }

  useEffect(() => {
    handleGetStudents()
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <h1 className="">{student?.nome}</h1>
      <div>
        <span>Email:</span> <span>{student?.email}</span>
      </div>
      <div>
        <span>Matrícula:</span> <span>{student?.matricula}</span>
      </div>
      <div>
        <span>CPF:</span> <span>{student?.cpf}</span>
      </div>
      <div>
        <span>Telefone:</span> <span>{student?.telefone}</span>
      </div>
      <div>
        <span>Endereço:</span> <span>{student?.endereco}</span>
      </div>
      <div>
        <span>Cidade:</span> <span>{student?.cidade}</span>
      </div>
      <div>
        <span>Estado:</span> <span>{student?.estado}</span>
      </div>
      <div>
        <span>Data de Ingresso:</span>{" "}
        <span>{student?.dataIngresso?.toLocaleDateString()}</span>
      </div>
      <div>
        <span>Data de Nascimento:</span>{" "}
        <span>{student?.dataNascimento?.toLocaleDateString()}</span>
      </div>
      <div>
        <span>Semestre Atual:</span> <span>{student?.semestreAtual}</span>
      </div>
      <div>
        <span>Turmas:</span>
        <ul className="list-disc ml-4">
          {student?.turmas.map((turma) => (
            <li key={turma.id}>{turma.name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
