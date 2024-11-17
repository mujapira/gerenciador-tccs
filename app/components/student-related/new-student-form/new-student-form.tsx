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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Fragment, use, useEffect, useState } from "react"
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { EmptyCard } from "../../empty-card"
import Image from "next/image"
import { IClass, ICreateStudentFormData } from "@/app/models/mongoModels"
import { createStudent, getClasses } from "@/app/server-actions/mongoActions"
import { DatePicker } from "@/components/ui/date-picker"

const FormSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length === 11, {
      message: "CPF deve conter 11 dígitos",
    }),
  telefone: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length === 11, {
      message: "Telefone deve conter 11 dígitos",
    }),
  endereco: z.string().min(3, "Endereço é obrigatório"),
  cidade: z.string().min(3, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
  data_nascimento: z.date({
    required_error: "Data de nascimento é obrigatória",
    invalid_type_error: "Data de nascimento inválida",
  }),
  turmaId: z.string().min(1, "Turma é obrigatória"),
  turmaNome: z.string().min(1, "Turma é obrigatória"),
});

function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

function formatPhoneNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    .slice(0, 15)
}

function generateMatricula(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")

  const matricula = `${year}${month}${day}${hours}-${minutes}${seconds}`
  return matricula
}

export default function NewStudentForm() {
  const [availableClasses, setAvailableClasses] = useState<IClass[]>([])
  const [studentClass, setStudentClass] = useState<IClass | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{
    key: string
    url: string
    name: string
  } | null>(null)

  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const fileExtension = file.name.split(".").pop()
      const uniqueFileName = `user-images/${Date.now()}.${fileExtension}`
      const fileUrl = URL.createObjectURL(file)
      setFile(file)

      setUploadedFile({
        key: uniqueFileName,
        url: fileUrl,
        name: file.name,
      })

      toast({
        title: "Upload realizado",
        description: `O arquivo ${file.name} foi carregado com sucesso.`,
      })
    }
  }

  const handleUploadClick = () => {
    document.getElementById("fileInput")?.click()
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const fetchAvailableClasses = async () => {
    const classes = await getClasses()
    setAvailableClasses(classes)
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let caminho = "/user-images/placeholder.png"

    if (file) {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        showErrorToast("Erro ao enviar a imagem")
        return
      }

      const result = await response.json()
      caminho = result.path
    }

    const createStudentFormData: ICreateStudentFormData = {
      nome: data.nome,
      email: data.email,
      matricula: generateMatricula(),
      cpf: data.cpf,
      telefone: data.telefone,
      endereco: data.endereco as string,
      cidade: data.cidade as string,
      estado: data.estado as string,
      data_nascimento: new Date(data.data_nascimento),
      semestre_atual: 1,
      caminho_foto: caminho,
      turma_id: data.turmaId as string,
      turma_nome: availableClasses.find((c) => c.id === data.turmaId)?.nome as string,
    }

    try {
      await createStudent(createStudentFormData,)

      toast({
        title: "Aluno cadastrado com sucesso",
        description: "O aluno foi cadastrado com sucesso.",
        variant: "default",
      })

      router.push("/alunos")
    } catch (error) {
      showErrorToast(error)
    }
  }

  const handleAddClass = async (classId: string) => {
    setStudentClass(
      availableClasses.find((c) => c.id === classId)!,
    )
    form.setValue("turmaId", classId)
    form.setValue("turmaNome", availableClasses.find((c) => c.id === classId)?.nome || "")

    await form.trigger(["turmaId", "turmaNome"]);
  }

  const handleRemoveClass = async (classId: string) => {
    setStudentClass(null)
    form.setValue("turmaId", "")
    form.setValue("turmaNome", "")

    await form.trigger(["turmaId", "turmaNome"]);

  }

  useEffect(() => {
    fetchAvailableClasses()
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
              className="w-full gap-2 flex flex-col">
              <div className="flex items-end justify-center gap-8">
                <Card className="border-none p-0 m-0 flex">
                  <CardContent className="p-0">
                    <input
                      type="file"
                      id="fileInput"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    {uploadedFile ? (
                      <ScrollArea className="cursor-pointer pb-4">
                        <div className="flex w-max">
                          <div className="relative h-72 w-96">
                            <Image
                              src={uploadedFile.url}
                              alt={uploadedFile.name}
                              fill
                              sizes="(min-width: 640px) 640px, 100vw"
                              loading="lazy"
                              className="rounded-md object-cover"
                            />
                          </div>
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    ) : (
                      <EmptyCard
                        onClick={handleUploadClick}
                        title="Nenhuma imagem selecionada"
                        description="Clique para selecionar a foto do aluno"
                        className="w-full cursor-pointer"
                      />
                    )}
                    {uploadedFile ? (
                      <Button
                        type="button"
                        onClick={() => setUploadedFile(null)}
                        variant="destructive"
                        className="w-full">
                        Remover foto
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="mt-4 w-full"
                        onClick={handleUploadClick}>
                        Escolher foto
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <div className="flex flex-col">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="nome">Nome</FormLabel>
                        <Input
                          id="nome"
                          placeholder="Nome"
                          {...field}
                          value={field.value || ""}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="cpf">CPF</FormLabel>
                          <Input
                            id="cpf"
                            placeholder="000.000.000-00"
                            {...field}
                            maxLength={14}
                            value={formatCPF(field.value || "")}
                            onChange={(e) => {
                              const digitsOnly = e.target.value.replace(
                                /\D/g,
                                ""
                              )
                              if (digitsOnly.length <= 11)
                                field.onChange(digitsOnly)
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="email">Email</FormLabel>
                          <Input
                            id="email"
                            placeholder="Email"
                            {...field}
                            value={field.value || ""}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-4 items-end w-full">
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="telefone">Telefone</FormLabel>
                          <Input
                            id="telefone"
                            placeholder="(00) 00000-0000"
                            {...field}
                            maxLength={15} // Restringe a entrada visual
                            value={formatPhoneNumber(field.value || "")}
                            onChange={(e) => {
                              // Remove caracteres não numéricos
                              const digitsOnly = e.target.value.replace(/\D/g, "");

                              // Limita o valor a 11 dígitos
                              if (digitsOnly.length <= 11) {
                                field.onChange(digitsOnly);
                              }
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="data_nascimento"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-1/2">
                          <FormLabel htmlFor="data_nascimento">
                            Data de Nascimento
                          </FormLabel>
                          <DatePicker
                            {...field}
                            onChange={(date) => {
                              field.onChange(date);
                              field.onBlur();
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="endereco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="endereco">Endereço</FormLabel>
                        <Input
                          id="endereco"
                          placeholder="Endereço"
                          {...field}
                          value={field.value || ""}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="cidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="cidade">Cidade</FormLabel>
                          <Input
                            id="cidade"
                            placeholder="Cidade"
                            {...field}
                            value={field.value || ""}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="estado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="estado">Estado</FormLabel>
                          <Input
                            id="estado"
                            placeholder="Estado"
                            {...field}
                            value={field.value || ""}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <CardDescription>
                Selecione a sala de aula que o aluno será matriculado.
              </CardDescription>

              <FormField
                control={form.control}
                name="turmaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="turma">Turmas</FormLabel>
                    {!studentClass && (
                      <CardDescription>
                        Aluno não está matriculado em nenhuma turma
                      </CardDescription>
                    )}
                    {!studentClass && (
                      <div className="flex items-center justify-start gap-4">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || ""}>
                          <SelectTrigger className="w-2/3">
                            <SelectValue placeholder="Selecione uma nova Turma" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableClasses.map((c) => (
                              <SelectItem key={c.id} value={c.id.toString()}>
                                {c.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          className=""
                          disabled={
                            !field.value || studentClass !== null
                          }
                          type="button"
                          onClick={() => handleAddClass(field.value!)}>
                          Adicionar
                        </Button>

                      </div>
                    )}
                    <div className="flex items-start flex-col justify-start w-full">
                      {studentClass && (
                        <Fragment>

                          <div
                            key={studentClass.id}
                            className="flex items-center justify-start gap-4 mt-4 w-full">
                            <span className="flex w-2/3 justify-between items-center p-2 border rounded text-sm">
                              {studentClass.nome}
                            </span>
                            <Button
                              variant="destructive"
                              onClick={() => handleRemoveClass(studentClass.id)}>
                              Remover
                            </Button>
                          </div>

                        </Fragment>
                      )}
                    </div>
                  </FormItem>
                )}
              />
              <Button
                className="mt-8"
                type="submit"
                disabled={
                  !form.formState.isValid ||
                  Object.keys(form.formState.touchedFields).length === 0
                }
              >  Cadastrar Aluno
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
