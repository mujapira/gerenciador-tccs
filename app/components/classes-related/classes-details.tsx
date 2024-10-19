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
import { IClassWithStudents } from "@/app/models/classes/classModel"
import { GetClassesDetails } from "@/app/server-actions/classes/getClassesDetails"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import { ClassesTable } from "./classes-table/classes-table"
import { GetStudents } from "@/app/server-actions/student/getStudents"
import { IStudent } from "@/app/models/student/studentsModel"
import { toast } from "@/hooks/use-toast"
import { UpdateClassStudents } from "@/app/server-actions/classes/updateClasseStudents"

function calcularIdade(dataNasc: string) {
  var dataAtual = new Date()
  var anoAtual = dataAtual.getFullYear()
  var mesAtual = dataAtual.getMonth() + 1
  var diaAtual = dataAtual.getDate()

  var dataNascimento = new Date(dataNasc)
  var anoNasc = dataNascimento.getFullYear()
  var mesNasc = dataNascimento.getMonth() + 1
  var diaNasc = dataNascimento.getDate()

  var idade = anoAtual - anoNasc

  if (mesAtual < mesNasc || (mesAtual == mesNasc && diaAtual < diaNasc)) {
    idade--
  }

  return idade
}

export function ClassesDetails() {
  const [classes, setClasses] = useState<IClassWithStudents[]>()
  const [selectedClass, setSelectedClass] = useState<IClassWithStudents | null>(
    null
  )
  const [students, setStudents] = useState<IStudent[]>()
  const [isEditing, setIsEditing] = useState(false)

  const getStudents = async () => {
    try {
      const response = await GetStudents()

      if (response) {
        setStudents(response as IStudent[])
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

  const [searchTerm, setSearchTerm] = useState("")

  const filteredStudents = students?.filter((student) =>
    student.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const onSelectStudent = (value: string) => {
    const selectedStudent = students?.find(
      (student) => student.id === Number(value)
    )

    if (selectedStudent) {
      setSelectedClass((prev) => {
        if (!prev) return null

        return {
          ...prev,
          alunos: [...prev.alunos, selectedStudent],
        }
      })
    }
  }

  const handleGetClasses = async () => {
    try {
      const response = await GetClassesDetails()

      if (response) {
        setClasses(response as IClassWithStudents[])
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

  const handleRemoveStudent = (studentId: number) => {
    setSelectedClass((prev) => {
      if (!prev) return null

      return {
        ...prev,
        alunos: prev.alunos.filter((aluno) => aluno.id !== studentId),
      }
    })
  }

  const handleSaveChanges = async () => {
    if (selectedClass) {
      try {
        // Call your API or function to update the selected class
        await UpdateClassStudents(selectedClass.id, selectedClass.alunos)
        setIsEditing(false)

        toast({
          title: "Alunos atualizados com sucesso.",
        })
      } catch (error) {
        showErrorToast("Erro ao atualizar alunos.")
      }
    }
  }

  const handleCancelEdit = () => {
    handleGetClasses()
    setIsEditing(false)
  }

  useEffect(() => {
    handleGetClasses()
    getStudents()
  }, [])

  return (
    <div className="flex w-full gap-6 items-start justify-start">
      <div className="flex flex-col gap-2">
        <Card className="w-auto">
          <CardHeader className="flex flex-row gap-2 items-center justify-between">
            <div className="flex flex-col">
              <CardTitle>Informações das turmas</CardTitle>
              <CardDescription>
                Dados gerais das turmas cadastradas no sistema
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ClassesTable
              onSelectClass={(classe) => setSelectedClass(classe)}
            />
            {selectedClass && (
              <Card className="w-auto mt-4">
                <CardHeader className="flex flex-row gap-2 items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <CardTitle>Alunos da Turma: {selectedClass.nome}</CardTitle>

                    <CardDescription>
                      {isEditing
                        ? "Adiconar alunos"
                        : "Lista de alunos matriculados nesta turma"}
                    </CardDescription>
                  </div>

                  <Button
                    disabled={isEditing}
                    onClick={() => setIsEditing(true)}>
                    Gerenciar alunos
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditing && (
                    <div className="flex gap-4">
                      <Input
                        placeholder="Filtrar por nome ou CPF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-1/3"
                      />

                      <Select onValueChange={onSelectStudent}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecionar aluno" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredStudents?.length &&
                            filteredStudents.map((student) => (
                              <SelectItem
                                key={student.id}
                                value={student.id.toString()}>
                                {student.nome} - {student.cpf}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {isEditing && <Separator className="my-4" />}

                  <div className="flex flex-col">
                    {selectedClass.alunos.map((aluno) => (
                      <div className="flex items-center justify-start p-0 gap-4 text-sm">
                        <Button
                          variant="ghost"
                          className="flex items-center justify-start p-0 px-2 gap-4">
                          <Link
                            href={`/alunos/${aluno.id}`}
                            key={aluno.id}
                            className="flex gap-2">
                            <Image
                              src={aluno.caminho_foto!}
                              alt="Foto do aluno"
                              width={22}
                              height={22}
                              className="rounded-full"
                            />
                            <span className="min-w-40 max-w-40 overflow-clip text-start">
                              {aluno.nome}
                            </span>
                          </Link>
                          <span className="min-w-48 max-w-48 overflow-clip text-start">
                            {aluno.email}
                          </span>
                          <span className="min-w-14 max-w-14 overflow-clip text-start">
                            {calcularIdade(aluno.data_nascimento.toString())}{" "}
                            anos
                          </span>
                        </Button>
                        {isEditing && (
                          <Button
                            variant="destructive"
                            className="h-6"
                            onClick={() => handleRemoveStudent(aluno.id)}>
                            Remover
                          </Button>
                        )}
                      </div>
                    ))}

                    {isEditing && (
                      <div className="flex gap-4 w-full items-center justify-end">
                        <Button
                          variant="outline"
                          className="mt-8"
                          onClick={handleCancelEdit}>
                          Cancelar
                        </Button>
                        <Button className="mt-8" onClick={handleSaveChanges}>
                          Salvar
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            {!selectedClass && (
              <Card className="w-auto mt-4">
                <CardHeader className="flex flex-row gap-2 items-center justify-between">
                  <div className="flex flex-col">
                    <CardTitle>Alunos da Turma</CardTitle>
                    <CardDescription>
                      Selecione uma turma para visualizar os alunos
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
