"use client"

import { Fragment, useEffect, useState } from "react"
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
import { IStudent } from "@/app/models/mongoModels"
import { getAllStudents, getStudent } from "@/app/server-actions/mongoActions"
import { formatCPF, formatPhoneNumber } from "@/app/utils/formatters"
interface GetStudentProps {
  id: string
}

export function StudentDetails({ id }: GetStudentProps) {
  const [student, setStudent] = useState<IStudent>()

  const handleGetStudents = async () => {
    try {
      const response = await getStudent(id)

      if (response) {
        setStudent(response as IStudent)
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

  function handleUserImage(photoPath: string | undefined) {
    if (!photoPath)
      return "/user-images/placeholder.png"


    const forbiddenWords = ["http", "https", "www", "github"]
    const isForbidden = forbiddenWords.some((word) =>
      photoPath.includes(word)
    )

    if (isForbidden) {
      return photoPath

    } else {
      return `${photoPath}`
    }
  }

  useEffect(() => {
    handleGetStudents()
  }, [])

  return (
    <div className="flex w-full gap-6 items-start justify-start">
      {student && (
        <div className="flex flex-col gap-6">
          <Card className="w-96">
            <CardHeader className="flex flex-row gap-2 items-center justify-between">
              <Image
                alt=""
                src={`${handleUserImage(student?.caminho_foto)}`}
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
                  <span>{student.nome}</span>
                </div>
                <div className="">
                  <span className="font-semibold">Email:</span>{" "}
                  <span>{student.email}</span>
                </div>
                <div className="">
                  <span className="font-semibold">CPF:</span>{" "}
                  <span>{formatCPF(student.cpf)}</span>
                </div>
                <div className="">
                  <span className="font-semibold">Telefone:</span>{" "}
                  <span>{formatPhoneNumber(student.telefone)}</span>
                </div>
                <div className="">
                  <span className="font-semibold">Endereço:</span>{" "}
                  <span>
                    {student.endereco}, {student.cidade}, {student.estado}
                  </span>
                </div>
                <div className="">
                  <span className="font-semibold">Data de Nascimento:</span>{" "}
                  <span>{student.data_nascimento?.toLocaleDateString()}</span>
                </div>
                <Button>
                  <Link href={`/alunos/editar/${student.id}`}>
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
                  <span>{student.matricula}</span>
                </div>
                <div className="">
                  <span className="font-semibold">Data de Ingresso:</span>{" "}
                  <span>{student.data_ingresso?.toLocaleDateString()}</span>
                </div>
                <div className="">
                  <span className="font-semibold">Semestre Atual:</span>{" "}
                  <span>{student.semestre_atual}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <Card className="">
          <CardHeader>
            <CardTitle>Turma</CardTitle>
            <CardDescription>Turma que o aluno participa</CardDescription>
          </CardHeader>
          <CardContent>

            {student?.turma_id !== null && (
              <div className="flex flex-col gap-4">
                <Link href={`/turmas/${student?.turma_id}`}>
                  <Button className="p-0" variant="link" key={student?.turma_id}>
                    {student?.turma_nome}
                  </Button>
                </Link>
              </div>
            )}

            {student?.turma_id === null && (
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
                  <Link href={`/${student.tcc.id}`}>
                    <Button
                      className="p-0 m-0 h-0"
                      variant="link"
                      key={student.tcc.id}>
                      {student.tcc.titulo}
                    </Button>
                  </Link>
                </div>
                <div className="">
                  <span className="font-semibold">Orientador:</span>{" "}
                  <Link href={`/${student.tcc.orientador.id}`}>
                    <Button
                      className="p-0 m-0 h-0"
                      variant="link"
                      key={student.tcc.orientador.id}>
                      {student.tcc.orientador.nome}
                    </Button>
                  </Link>
                </div>
                <div className="">
                  <span className="font-semibold">Tema:</span>{" "}
                  <Link href={`/${student.tcc.tema.id}`}>
                    <Button
                      className="p-0 m-0 h-0"
                      variant="link"
                      key={student.tcc.tema.id}>
                      <span>{student.tcc.tema.descricao}</span>
                    </Button>
                  </Link>
                </div>
                <div className="">
                  <span className="font-semibold">Classificação:</span>{" "}
                  <Link href={`/${student.tcc.classificacao.id}`}>
                    <Button
                      className="p-0 m-0 h-0"
                      variant="link"
                      key={student.tcc.classificacao.id}>
                      {student.tcc.classificacao.descricao}
                    </Button>
                  </Link>
                </div>
                <div className="">
                  <span className="font-semibold">Nota Final:</span>{" "}
                  <span>{student.tcc.notaFinal || "N/A"}</span>
                </div>
                <div className="">
                  <span className="font-semibold">Estado Atual:</span>{" "}
                  <span>{student.tcc.status}</span>
                </div>
                <div className="">
                  <span className="font-semibold">Número de Avaliações:</span>{" "}
                  <span>{student.tcc.avaliacoes.length}</span>
                </div>
                <div className=" max-w-[500px] flex gap-1">
                  <span className="font-semibold text-wrap">
                    Palavras-chave:
                  </span>
                  <div className="flex gap-2">
                    {student.tcc.palavras_chave.map((keyWord, i) => (
                      <Link
                        href={`/${keyWord.id}`}
                        key={keyWord.id}
                        className="">
                        <Button className="p-0 m-0 h-0" variant="link">
                          {keyWord.descricao}
                          {student.tcc &&
                            i < student.tcc.palavras_chave.length - 1
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
