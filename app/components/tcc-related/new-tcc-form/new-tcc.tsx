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
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IClass } from "@/app/models/classes/classModel"
import { Fragment, use, useEffect, useState } from "react"
import { GetClasses } from "@/app/server-actions/classes/getClasses"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { INewStudentFormData } from "@/app/models/student/createStudentModel"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { showErrorToast } from "@/app/utils/toast-utils"
import { INewTccFormData } from "@/app/models/tcc/newTccForm"
import { ITeacher } from "@/app/models/teacher/teacherModel"
import { GetTeachers } from "@/app/server-actions/teachers/getTeachers"
import { IStudent } from "@/app/models/student/studentsModel"
import { GetStudents } from "@/app/server-actions/student/getStudents"
import {
  CreateTcc,
  GetClassifications,
  GetThemes,
} from "@/app/server-actions/tcc/createTcc"

const FormSchema = z.object({
  titulo: z.string(),
  aluno_id: z.number().int(),
  classificacao_id: z.number().int(),
  orientador_id: z.number().int(),
  tema_id: z.number().int(),
  turma_id: z.number().int(),
})

export interface IClassification {
  id: number
  descricao: string
}

export interface ITheme {
  id: number
  descricao: string
}

export default function NewTccForm() {
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const [availableClasses, setAvailableClasses] = useState<IClass[]>()
  const [selectedClass, setSelectedClass] = useState<IClass>()

  const [availableClassifications, setAvailableClassifications] =
    useState<IClassification[]>()
  const [selectedClassification, setSelectedClassification] =
    useState<IClassification>()

  const [availableTeachers, setAvailableTeachers] = useState<ITeacher[]>()
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacher>()
  const [availableStudents, setAvailableStudents] = useState<IStudent[]>()
  const [selectedStudent, setSelectedStudent] = useState<IStudent>()

  const [availableThemes, setAvailableThemes] = useState<ITheme[]>()
  const [selectedTheme, setSelectedTheme] = useState<ITheme>()

  const fetchAvailableThemes = async () => {
    try {
      const themes = await GetThemes()
      setAvailableThemes(themes)
    } catch (error) {
      showErrorToast(error)
    }
  }

  const fetchAvailableClasses = async () => {
    try {
      const classes = await GetClasses()
      setAvailableClasses(classes)
    } catch (error) {
      showErrorToast(error)
    }
  }

  const fetchAvailableClassifications = async () => {
    try {
      const classifications = await GetClassifications()
      setAvailableClassifications(classifications)
    } catch (error) {
      showErrorToast(error)
    }
  }

  const fetchAvailableTeachers = async () => {
    try {
      const teachers = await GetTeachers()
      setAvailableTeachers(teachers)
    } catch (error) {
      showErrorToast(error)
    }
  }

  const fetchAvailableStudents = async () => {
    try {
      const students = await GetStudents()
      setAvailableStudents(students)
    } catch (error) {
      showErrorToast(error)
    }
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const createTcc: INewTccFormData = {
      tcc: {
        metadata_id: null,
        titulo: data.titulo,
        status: 1,
      },
      metadata: {
        aluno_id: data.aluno_id,
        classificacao_id: data.classificacao_id,
        orientador_id: data.orientador_id,
        tema_id: data.tema_id,
        turma_id: data.turma_id,
      },
    }

    try {
      await CreateTcc(createTcc.tcc, createTcc.metadata)

      toast({
        title: "TCC cadastrado com sucesso",
        description: "O TCC foi cadastrado com sucesso.",
        variant: "default",
      })

      router.push("/tccs")
    } catch (error) {
      showErrorToast(error)
    }
  }

  useEffect(() => {
    fetchAvailableClasses()
    fetchAvailableClassifications()
    fetchAvailableTeachers()
    fetchAvailableStudents()
    fetchAvailableThemes()
  }, [])

  return (
    <div>
      <Card className="w-auto">
        <CardHeader>
          <CardTitle>Informações do novo aluno</CardTitle>
          <CardDescription>
            Informe os dados do novo aluno para cadastrá-lo no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full gap-4 flex flex-col">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="titulo">Título do TCC</FormLabel>
                    <Input id="titulo" placeholder="Título do TCC" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-4" />

              <FormField
                control={form.control}
                name="aluno_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aluno</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value.toString() : ""}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um aluno" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStudents?.map((student) => (
                          <SelectItem
                            key={student.id}
                            value={student.id.toString()}>
                            {student.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="turma_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turma</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value.toString() : ""}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma turma" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClasses?.map((classe) => (
                          <SelectItem
                            key={classe.id}
                            value={classe.id.toString()}>
                            {classe.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orientador_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orientador</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value.toString() : ""}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um orientador" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTeachers?.map((teacher) => (
                          <SelectItem
                            key={teacher.id}
                            value={teacher.id.toString()}>
                            {teacher.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classificacao_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classificação</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value.toString() : ""}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma classificação" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClassifications?.map((classification) => (
                          <SelectItem
                            key={classification.id}
                            value={classification.id.toString()}>
                            {classification.descricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tema_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value.toString() : ""}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um tema" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableThemes?.map((theme) => (
                          <SelectItem
                            key={theme.id}
                            value={theme.id.toString()}>
                            {theme.descricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="mt-8" type="submit">
                Cadastrar TCC
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
