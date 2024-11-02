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
import { Fragment, use, useCallback, useEffect, useState } from "react"
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
import { CreateTcc } from "@/app/server-actions/tcc/createTcc"
import { GetThemes, ITheme } from "@/app/server-actions/tcc/getThemes"
import { GetTccClassifications } from "@/app/server-actions/tcc/getClassifications"
import { IClassification } from "@/app/models/classification/classificationModel"

const FormSchema = z.object({
  titulo: z.string().min(1, { message: "Título não pode estar vazio" }),
  aluno_id: z.number().int().refine((value) => value !== 0, {
    message: "Selecione um aluno válido",
  }),
  classificacao_id: z.number().int().refine((value) => value !== 0, {
    message: "Selecione uma classificação válida",
  }),
  orientador_id: z.number().int().refine((value) => value !== 0, {
    message: "Selecione um orientador válido",
  }),
  tema_id: z.number().int().refine((value) => value !== 0, {
    message: "Selecione um tema válido",
  }),
  turma_id: z.number().int().refine((value) => value !== 0, {
    message: "Selecione uma turma válida",
  }),
});

export default function NewTccForm() {
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      titulo: "",
      aluno_id: 0,
      classificacao_id: 0,
      orientador_id: 0,
      tema_id: 0,
      turma_id: 0,
    },
  })

  const [loading, setLoading] = useState(false)

  const [availableData, setAvailableData] = useState<{
    classes?: IClass[]
    classifications?: IClassification[]
    teachers?: ITeacher[]
    students?: IStudent[]
    themes?: ITheme[]
  }>({
    classes: [],
    classifications: [],
    teachers: [],
    students: [],
    themes: [],
  })

  const [selectedData, setSelectedData] = useState<{
    class?: IClass
    classification?: IClassification
    teacher?: ITeacher
    student?: IStudent
    theme?: ITheme
  }>({})

  const fetchAvailableData = useCallback(async () => {
    try {
      setLoading(true)

      const [classes, classifications, teachers, students, themes] =
        await Promise.all([
          GetClasses(),
          GetTccClassifications(),
          GetTeachers(),
          GetStudents(),
          GetThemes(),
        ])

      setAvailableData({
        classes,
        classifications,
        teachers,
        students,
        themes,
      })

      setLoading(false)
    } catch (error) {
      showErrorToast(error)
      setLoading(false)
    }
  }, [])

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
      console.log("onSubmit", error)
      showErrorToast(error)
    }
  }

  

  useEffect(() => {
    fetchAvailableData()
    router.prefetch("/tccs")
  }, [fetchAvailableData])

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
                    <Input
                      id="titulo"
                      placeholder="Título do TCC"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-4" />
              {loading && <span>Carregando...</span>}
              {!loading && availableData && (
                <>
                  <FormField
                    control={form.control}
                    name="aluno_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aluno</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value ? field.value.toString() : ""}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um aluno" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableData.students?.map((student) => (
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
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value ? field.value.toString() : ""}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma turma" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableData.classes?.map((classe) => (
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
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value ? field.value.toString() : ""}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um orientador" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableData.teachers?.map((teacher) => (
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
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value ? field.value.toString() : ""}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma classificação" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableData.classifications?.map(
                              (classification) => (
                                <SelectItem
                                  key={classification.id}
                                  value={classification.id.toString()}>
                                  {classification.descricao}
                                </SelectItem>
                              )
                            )}
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
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value ? field.value.toString() : ""}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um tema" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableData.themes?.map((theme) => (
                              <SelectItem
                                key={theme.id}
                                value={theme.id.toString()}>
                                {theme.tema}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <Button
                disabled={
                  loading ||
                  form.formState.isSubmitting ||
                  !form.formState.isValid
                }
                className="mt-8"
                type="submit">
                Cadastrar TCC
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
