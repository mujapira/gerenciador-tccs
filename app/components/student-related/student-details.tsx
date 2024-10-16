"use client"

import { useEffect, useState } from "react"
import { GetStudentDetails } from "../../server-actions/getStudentDetails"
import { IDetailedStudent } from "@/app/models/detailedStudentModel"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    <div className="flex w-full gap-6 items-start justify-start">
      <div className="flex flex-col gap-6">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Dados gerais do aluno cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 text-sm">
              <div className="">
                <span className="font-semibold">Nome:</span>{" "}
                <span>{student?.nome}</span>
              </div>
              <div className="">
                <span className="font-semibold">Email:</span>{" "}
                <span>{student?.email}</span>
              </div>
              <div className="">
                <span className="font-semibold">CPF:</span>{" "}
                <span>{student?.cpf}</span>
              </div>
              <div className="">
                <span className="font-semibold">Telefone:</span>{" "}
                <span>{student?.telefone}</span>
              </div>
              <div className="">
                <span className="font-semibold">Endereço:</span>{" "}
                <span>
                  {student?.endereco}, {student?.cidade}, {student?.estado}
                </span>
              </div>
              <div className="">
                <span className="font-semibold">Data de Nascimento:</span>{" "}
                <span>{student?.dataNascimento?.toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-96">
          <CardHeader>
            <CardTitle>Informações Acadêmicas</CardTitle>
            <CardDescription>
              Dados acadêmicos do aluno cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 text-sm">
              <div className="">
                <span className="font-semibold">Matrícula:</span>{" "}
                <span>{student?.matricula}</span>
              </div>
              <div className="">
                <span className="font-semibold">Data de Ingresso:</span>{" "}
                <span>{student?.dataIngresso?.toLocaleDateString()}</span>
              </div>
              <div className="">
                <span className="font-semibold">Semestre Atual:</span>{" "}
                <span>{student?.semestreAtual}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        <Card className="">
          <CardHeader>
            <CardTitle>Classes</CardTitle>
            <CardDescription>Turmas que o aluno participa</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="">
              {student?.turmas.map((turma) => (
                <li key={turma.id}>{turma.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>TCC</CardTitle>
            <CardDescription>
              Situação do trabalho de conclusão de curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            {student?.tcc ? (
              <div className="flex flex-col gap-2 text-sm">
                <div className="">
                  <span className="font-semibold">Título:</span>{" "}
                  <span>{student.tcc.titulo}</span>
                </div>
                <div className="">
                  <span className="font-semibold">Orientador:</span>{" "}
                  <span>{student.tcc.orientador}</span>
                </div>
                <div className="">
                  <span className="font-semibold">Tema:</span>{" "}
                  <span>{student.tcc.tema}</span>
                </div>
                <div className="">
                  <span className="font-semibold">Classificação:</span>{" "}
                  <span>{student.tcc.classificacao}</span>
                </div>
                <div className="">
                  <span className="font-semibold">Nota Final:</span>{" "}
                  <span>{student.tcc.notaFinal || "N/A"}</span>
                </div>
                <div className="">
                  <span className="font-semibold">Estado Atual:</span>{" "}
                  <span>{student.tcc.estadoAtual}</span>
                </div>
                <div className="">
                  <span className="font-semibold">Número de Avaliações:</span>{" "}
                  <span>{student.tcc.numeroAvaliacoes}</span>
                </div>
                <div className="">
                  <span className="font-semibold">
                    Data da Última Avaliação:
                  </span>{" "}
                  <span>
                    {student.tcc.dataUltimaAvaliacao?.toLocaleDateString() ||
                      "N/A"}
                  </span>
                </div>
                <div className=" max-w-[500px]">
                  <span className="font-semibold text-wrap">
                    Palavras-chave:
                  </span>{" "}
                  <span>{student.tcc.palavrasChave || "N/A"}</span>
                </div>
              </div>
            ) : (
              <p>Nenhum TCC registrado para este aluno.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
