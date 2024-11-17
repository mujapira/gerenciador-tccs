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
import { ITeacher } from "@/app/models/mongoModels"
import { getOrientador } from "@/app/server-actions/mongoActions"
interface GetTeacherProps {
  id: string
}

export function TeacherDetails({ id }: GetTeacherProps) {
  const [student, setStudent] = useState<ITeacher>()

  const handleGetTeachers = async () => {
    try {
      const response = await getOrientador(id)

      if (response) {
        setStudent(response as ITeacher)
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
                  TCCs que o que o orientador está participando
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* {student?.tcc && (
                  <div className="flex flex-col gap-4">
                    {student?.tcc.map((tcc) => (
                      <Card>
                        <CardHeader key={tcc.tccId}>
                          <div className="">
                            <Link href={`/${tcc.tccId}`}>
                              <Button
                                className="p-0 m-0 h-0"
                                variant="link"
                                key={tcc.tccId}>
                                {tcc.tituloTcc}
                              </Button>
                            </Link>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col gap-2 text-sm">
                            <div className="">
                              <span>{tcc.estadoAtual}</span>
                            </div>
                            <div className="">
                              <span className="font-semibold">
                                Número de Avaliações:
                              </span>{" "}
                              <span>{tcc.numeroAvaliacoes}</span>
                            </div>
                            <div className="">
                              <span className="font-semibold">
                                Data da Última Avaliação:
                              </span>{" "}
                              <span>
                                {tcc.dataUltimaAvaliacao?.toLocaleDateString() ||
                                  "N/A"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )} */}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
