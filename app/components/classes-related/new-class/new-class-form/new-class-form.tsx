"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"

import { z } from "zod"

import { Fragment, use, useEffect, useState } from "react"

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { showErrorToast } from "@/app/utils/toast-utils"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { IStudent } from "@/app/models/mongoModels"
import { createClass, getAllStudents } from "@/app/server-actions/mongoActions"

const FormSchema = z.object({
  nome: z.string().min(1, "O nome da turma é obrigatório"),
})

export default function NewClassForm() {
  const [selectedStudents, setSelectedStudents] = useState<IStudent[]>([])
  const [students, setStudents] = useState<IStudent[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  )
  const filteredStudents = students
    ?.filter(
      (student) =>
        student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.cpf.includes(searchTerm)
    )
    .filter(
      (student) =>
        !selectedStudents.find(
          (selectedStudent) => selectedStudent.id === student.id
        )
    )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(data: z.infer<typeof FormSchema>): Promise<void> {
    try {
      await createClass(data.nome, selectedStudents)
      toast({ title: "Turma criada com sucesso!" })
      router.push("/turmas")
    } catch (error) {
      showErrorToast(error)
    }
  }

  async function fetchStudents() {
    const students = await getAllStudents()
    setStudents(students)
  }

  const onSelectStudent = (value: string) => {
    const selectedStudent = students?.find(
      (student) => student.id === value
    )

    if (selectedStudent) {
      setSelectedStudents([...selectedStudents, selectedStudent])
    }

    setSearchTerm("")
  }

  const handleRemoveStudent = (studentId: string) => {
    const updatedStudents = selectedStudents.filter(
      (student) => student.id !== studentId
    )
    setSelectedStudents(updatedStudents)
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  return (
    <Card className="w-auto">
      <CardHeader>
        <CardTitle>Criar nova turma</CardTitle>
        <CardDescription>
          Informe os dados da nova turma para cadastrá-la no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4 min-w-[600px]">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova turma</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da turma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Filtrar por nome ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-2/3"
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

              {selectedStudents.map((aluno) => (
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
                  </Button>

                  <Button
                    variant="destructive"
                    className="h-6"
                    onClick={() => handleRemoveStudent(aluno.id)}>
                    Remover
                  </Button>
                </div>
              ))}
            </div>

            <Button type="submit">Criar Turma</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
