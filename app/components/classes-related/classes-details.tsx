"use client"

import { Fragment, useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { showErrorToast } from "@/app/utils/toast-utils"
import Image from "next/image"
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
import { toast } from "@/hooks/use-toast"
import { IClass, IStudent } from "@/app/models/mongoModels"
import { calcularIdade } from "@/app/utils/age"
import { getAllStudents, getClasses, updateClassStudents } from "@/app/server-actions/mongoActions"


export function ClassesDetails() {
  const [classes, setClasses] = useState<IClass[]>()
  const [selectedClass, setSelectedClass] = useState<IClass | null>(
    null
  )
  const [originalClass, setOriginalClass] = useState<IClass | null>(
    null
  ) // Store original state
  const [students, setStudents] = useState<IStudent[]>()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  )
  const [searchTerm, setSearchTerm] = useState("")

  const getStudents = async () => {
    try {
      const response = await getAllStudents()
      if (response) {
        setStudents(response as IStudent[])
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

  const filteredStudents = students
    ?.filter(
      (student) =>
        student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.cpf.includes(searchTerm)
    )
    .filter(
      (student) =>
        !selectedClass?.alunos.some((aluno) => aluno.id === student.id)
    )

  const onSelectStudent = (value: string) => {
    const selectedStudent = students?.find(
      (student) => student.id === value
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

    setSelectedStudentId(null)
    setSearchTerm("")
  }

  const handleGetClasses = async () => {
    try {
      const response = await getClasses()
      if (response) {
        setClasses(response as IClass[])
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

  const handleEditClass = () => {
    if (!selectedClass) return
    setOriginalClass({ ...selectedClass })
    setIsEditing(true)
  }

  const handleRemoveStudent = (studentId: string) => {
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
        await updateClassStudents(selectedClass.id, selectedClass.alunos)
        
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
    if (originalClass) {
      setSelectedClass({ ...originalClass })
    }
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
                    onClick={() => handleEditClass()}>
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

                      <Select
                        value={selectedStudentId || ""}
                        onValueChange={(value) => {
                          onSelectStudent(value)
                          setSelectedStudentId(null) // Reset to show placeholder after selection
                          setSearchTerm("") // Clear the search term
                        }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecionar aluno" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredStudents && filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                              <SelectItem
                                key={student.id}
                                value={student.id.toString()}>
                                {student.nome} - {student.cpf}
                              </SelectItem>
                            ))
                          ) : (
                            <span className="text-sm">Nenhum resultado</span>
                          )}
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