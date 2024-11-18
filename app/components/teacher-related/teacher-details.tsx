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
import { formatCPF, formatPhoneNumber } from "@/app/utils/formatters"
import { ITcc, ITeacher } from "@/app/models/mongoModels"
import { getOrientador, getOrientadorTccs } from "@/app/server-actions/mongoActions"
interface GetTeacherProps {
  id: string
}

export function TeacherDetails({ id }: GetTeacherProps) {
  const [student, setStudent] = useState<ITeacher>()
  const [tccs, setTccs] = useState<ITcc[]>([])

  const handleGetTeachers = async () => {
    try {
      const response = await getOrientador(id)
      const responseTccs = await getOrientadorTccs(id)

      if (response) {
        setStudent(response as ITeacher)
      }

      if (responseTccs) {
        setTccs(responseTccs as ITcc[])
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

  useEffect(() => {
    handleGetTeachers()
  }, [])

  return (
    <div className="flex w-full gap-6 items-start justify-start">
      {student && (
        <>
          <div className="flex flex-col gap-6">
            <Card className="w-96">
              <CardHeader className="flex flex-row gap-2 items-center justify-between">
                <Image
                  alt=""
                  src={student?.caminho_foto || "/images/placeholder.png"}
                  width={24}
                  height={24}
                  className="rounded-full aspect-square w-8"
                />
                <div className="flex flex-col">
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Dados gerais do orientador cadastrado no sistema
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
                    <span>{formatCPF(student?.cpf)}</span>
                  </div>
                  <div className="">
                    <span className="font-semibold">Telefone:</span>{" "}
                    <span>{formatPhoneNumber(student?.telefone)}</span>
                  </div>
                  <Button>
                    <Link href={`/orientadores/editar/${student?.id}`}>
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
                  Dados acadêmicos do orientador cadastrado no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="">
                    <span className="font-semibold">Título acadêmico:</span>{" "}
                    <span>{student?.titulo_academico}</span>
                  </div>
                  <div className="">
                    <span className="font-semibold">Departamento:</span>{" "}
                    <span>{student?.departamento}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-6">
            <Card className="">
              <CardHeader>
                <CardTitle>TCCs</CardTitle>
                <CardDescription>
                  TCCs que o que o orientador está envolvido
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tccs && (
                  <div className="flex flex-col gap-2">
                    {tccs.map((tcc) => (
                      <Card key={tcc.id}>
                        <CardContent className="px-4 py-2">
                          <div className="flex flex-col gap-4 text-sm">
                            <div className="">
                              <Link href={`/${tcc.id}`} className="flex items-center justify-between gap-4">
                                <Button
                                  className="p-0 m-0 h-0"
                                  variant="link"
                                  key={tcc.id}>
                                  <div className="">
                                    <span className="font-semibold">
                                      {tcc.titulo}
                                    </span>
                                  </div>
                                </Button>
                                <div className="">
                                  {tcc.status.descricao === "Pendente de Revisão" && (
                                    <span className="bg-yellow-700 px-2 py-1 font-bold">
                                      {tcc.status.descricao}
                                    </span>
                                  )}
                                  {tcc.status.descricao === "Aprovado" && (
                                    <span className="bg-green-700 px-2 py-1 font-bold">
                                      {tcc.status.descricao}
                                    </span>
                                  )}
                                  {tcc.status.descricao === "Em Avaliação" && (
                                    <span className="bg-blue-700 px-2 py-1 font-bold">
                                      {tcc.status.descricao}
                                    </span>
                                  )}
                                  {tcc.status.descricao === "Reprovado" && (
                                    <span className="bg-red-700 px-2 py-1 font-bold">
                                      {tcc.status.descricao}
                                    </span>
                                  )}

                                </div>
                              </Link>
                            </div>
                            <Link href={`/aluno/${tcc.aluno.id}`} className="flex items-center justify-between gap-4">
                              <Button
                                className="px-0 m-0 h-0 w-full"
                                variant="link"
                              >
                                <div className="flex gap-2 w-full">
                                  <Image src={tcc.aluno.caminho_foto || "/images/placeholder.png"} alt="" width={20} height={20} className="rounded-full object-cover min-w-3 min-h-3" />
                                  <span className="font-semibold">
                                    {tcc.aluno.nome}
                                  </span>
                                </div>
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )
      }
    </div >
  )
}
