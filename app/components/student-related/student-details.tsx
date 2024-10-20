"use client"

import { Fragment, useEffect, useState } from "react"
import { GetStudentDetails } from "../../server-actions/student/getStudentDetails"
import { IDetailedStudent } from "@/app/models/student/detailedStudentModel"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, PlusCircleIcon, PlusIcon } from "lucide-react"
import { showErrorToast } from "@/app/utils/toast-utils"
import Image from "next/image"
interface GetStudentProps {
  id: number
}

export function StudentDetails({ id }: GetStudentProps) {
  const [student, setStudent] = useState<IDetailedStudent>()

  const handleGetStudents = async () => {
    try {
      const response = await GetStudentDetails(id)

      if (response) {
        setStudent(response as IDetailedStudent)
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

  useEffect(() => {
    handleGetStudents()
  }, [])

  return (
    <div className="flex w-full gap-6 items-start justify-start">
      <div className="flex flex-col gap-6">
        <Card className="w-96">
          <CardHeader className="flex flex-row gap-2 items-center justify-between">
            <Image
              alt=""
              src={`${student?.photoPath ?? "/user-images/placeholder.png"}`}
              width={24}
              height={24}
              className="rounded-full aspect-square w-8"
            />
            <div className="flex flex-col">
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Dados gerais do aluno cadastrados no sistema
              </CardDescription>
            </div>
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
              <Button>
                <Link href={`/alunos/editar/${student?.id}`}>
                  Editar informações
                </Link>
              </Button>
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
            {student?.turmas && student?.turmas.length > 0 && (
              <div className="flex flex-col gap-4">
                {student?.turmas.map((turma) => (
                  <Link href={`/${turma.id}`}>
                    <Button className="p-0" variant="link" key={turma.id}>
                      {turma.nome}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
            {student?.turmas && student?.turmas.length === 0 && (
              <Fragment>
                <p className="text-sm mb-2">
                  Nenhuma turma cadastrada para este aluno.
                </p>
                <Button>Atribuir a uma turma</Button>
              </Fragment>
            )}
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
                  <Link href={`/${student.tcc.tccId}`}>
                    <Button
                      className="p-0 m-0 h-0"
                      variant="link"
                      key={student.tcc.tccId}>
                      {student.tcc.titulo}
                    </Button>
                  </Link>
                </div>
                <div className="">
                  <span className="font-semibold">Orientador:</span>{" "}
                  <Link href={`/${student.tcc.orientadorId}`}>
                    <Button
                      className="p-0 m-0 h-0"
                      variant="link"
                      key={student.tcc.orientadorId}>
                      {student.tcc.orientador}
                    </Button>
                  </Link>
                </div>
                <div className="">
                  <span className="font-semibold">Tema:</span>{" "}
                  <Link href={`/${student.tcc.temaId}`}>
                    <Button
                      className="p-0 m-0 h-0"
                      variant="link"
                      key={student.tcc.temaId}>
                      <span>{student.tcc.tema}</span>
                    </Button>
                  </Link>
                </div>
                <div className="">
                  <span className="font-semibold">Classificação:</span>{" "}
                  <Link href={`/${student.tcc.classificacaoId}`}>
                    <Button
                      className="p-0 m-0 h-0"
                      variant="link"
                      key={student.tcc.classificacaoId}>
                      {student.tcc.classificacao}
                    </Button>
                  </Link>
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
                <div className=" max-w-[500px] flex gap-1">
                  <span className="font-semibold text-wrap">
                    Palavras-chave:
                  </span>
                  <div className="flex gap-2">
                    {student.tcc.palavrasChave.map((keyWord, i) => (
                      <Link
                        href={`/${keyWord.wordId}`}
                        key={keyWord.wordId}
                        className="">
                        <Button className="p-0 m-0 h-0" variant="link">
                          {keyWord.word}
                          {student.tcc &&
                          i < student.tcc.palavrasChave.length - 1
                            ? ","
                            : ""}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Fragment>
                <p className="text-sm mb-2">
                  Nenhum TCC registrado para este aluno.
                </p>
                <Button>Cadastrar TCC</Button>
              </Fragment>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
