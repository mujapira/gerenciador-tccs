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
import { Fragment, use, useCallback, useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { showErrorToast } from "@/app/utils/toast-utils"
import { IClass, IClassification, IKeyword, IStudent, ITeacher, ITheme } from "@/app/models/mongoModels"
import { createNewTcc, getAllClassifications, getAllKeyWords, getAllOrientadores, getAllStudents, getAllThemes, getClasses, ICreateTccFormData } from "@/app/server-actions/mongoActions"


const FormSchema = z.object({
  titulo: z.string().min(1, { message: "Título não pode estar vazio" }),
  aluno_id: z.string().refine((value) => value !== "", {
    message: "Selecione um aluno válido",
  }),
  classificacao_id: z.string().refine((value) => value !== "", {
    message: "Selecione uma classificação válida",
  }),
  orientador_id: z.string().refine((value) => value !== "", {
    message: "Selecione um orientador válido",
  }),
  tema_id: z.string().refine((value) => value !== "", {
    message: "Selecione um tema válido",
  }),
  turma_id: z.string().refine((value) => value !== "", {
    message: "Selecione uma turma válida",
  }),
  keywords: z.array(z.string()),
});

export default function NewTccForm() {
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      titulo: "",
      aluno_id: "",
      classificacao_id: "",
      orientador_id: "",
      tema_id: "",
      turma_id: "",
      keywords: [],
    },
  })

  const [loading, setLoading] = useState(false)

  const [availableData, setAvailableData] = useState<{
    classes?: IClass[]
    classifications?: IClassification[]
    teachers?: ITeacher[]
    students?: IStudent[]
    themes?: ITheme[]
    keywords?: IKeyword[]
  }>({
    classes: [],
    classifications: [],
    teachers: [],
    students: [],
    themes: [],
    keywords: [],
  })

  const [selectedData, setSelectedData] = useState<{
    class?: IClass
    classification?: IClassification
    teacher?: ITeacher
    student?: IStudent
    theme?: ITheme
    keywords?: IKeyword[]
  }>({})

  const fetchAvailableData = useCallback(async () => {
    try {
      setLoading(true)

      const [classes, classifications, teachers, students, themes, keywords] =
        await Promise.all([
          getClasses(),
          getAllClassifications(),
          getAllOrientadores(),
          getAllStudents(),
          getAllThemes(),
          getAllKeyWords(),
        ])

      setAvailableData({
        classes,
        classifications,
        teachers,
        students,
        themes,
        keywords,
      })

      setLoading(false)
    } catch (error) {
      showErrorToast(error)
      setLoading(false)
    }
  }, [])

  async function onSubmit(data: z.infer<typeof FormSchema>) {

    const createTcc: ICreateTccFormData = {
      titulo: data.titulo,
      aluno: availableData.students?.find(
        (student) => student.id === data.aluno_id
      ) || { id: "", nome: "" },
      tema: availableData.themes?.find((theme) => theme.id === data.tema_id) || { id: "", descricao: "" },
      classificacao: availableData.classifications?.find(
        (classification) => classification.id === data.classificacao_id
      ) || { id: "", descricao: "" },
      orientador: availableData.teachers?.find(
        (teacher) => teacher.id === data.orientador_id
      ) || { id: "", nome: "" },
      palavras_chave: data.keywords.map((palavra, index) => ({
        id: `${index}`,
        palavra,
      })),
    }

    try {
      console.log("createTcc", createTcc)
      await createNewTcc(createTcc)

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
      <Card className="w-auto min-w-[640px]">
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
                  <FormItem className="w-full">
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
                  <div className="flex gap-4 w-full items-center justify-between">
                    <FormField
                      control={form.control}
                      name="aluno_id"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Aluno</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange((value))
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
                        <FormItem className="w-full">
                          <FormLabel>Turma</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange((value))
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
                  </div>

                  <div className="flex gap-4 w-full items-center justify-between">
                    <FormField
                      control={form.control}
                      name="orientador_id"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Orientador</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange((value))
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
                        <FormItem className="w-full">
                          <FormLabel>Classificação</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange((value))
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
                  </div>

                  <div className="flex gap-4 w-full items-start justify-between">
                    <FormField
                      control={form.control}
                      name="tema_id"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Tema</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange((value))
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
                                  {theme.descricao}
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
                      name="keywords"
                      render={() => (
                        <FormItem className="w-full">
                          <FormLabel>Palavras-Chave</FormLabel>
                          <div className="flex flex-col gap-2">
                            <Select
                              onValueChange={(value) => {
                                if (!form.watch("keywords").includes(value)) {
                                  const updatedKeywords = [...form.watch("keywords"), value];
                                  form.setValue("keywords", updatedKeywords);
                                  value = "";
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione uma palavra-chave" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableData.keywords?.map((keyword) => (
                                  <SelectItem key={keyword.id} value={keyword.palavra}>
                                    {keyword.palavra}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {form.watch("keywords").map((keyword, index) => (
                              <div key={index} className="flex items-center gap-4">
                                <Input
                                  value={keyword}
                                  placeholder="Digite ou selecione uma palavra-chave"
                                  onChange={(e) =>
                                    form.setValue(
                                      `keywords.${index}`,
                                      e.target.value
                                    )
                                  }
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  onClick={() => {
                                    const updatedKeywords = [...form.watch("keywords")];
                                    updatedKeywords.splice(index, 1);
                                    form.setValue("keywords", updatedKeywords);
                                  }}
                                >
                                  Remover
                                </Button>
                              </div>
                            ))}


                            <Button
                              type="button"
                              variant={"secondary"}
                              onClick={() => {
                                const updatedKeywords = [
                                  ...form.watch("keywords"),
                                  "",
                                ];
                                form.setValue("keywords", updatedKeywords);
                              }}
                            >
                              Adicionar Palavra-Chave não cadastrada
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
