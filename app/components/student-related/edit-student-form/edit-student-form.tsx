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
import { format, set } from "date-fns"
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
import { IClass, IStudent, IUpdateStudentFormData } from "@/app/models/mongoModels"
import { getClasses, getStudent, updateStudent } from "@/app/server-actions/mongoActions"
import { formatCPF, formatPhoneNumber } from "@/app/utils/formatters"


const FormSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length === 11, {
      message: "CPF deve conter 11 dígitos numéricos",
    }),
  telefone: z
    .string()
    .regex(/^\d{11}$/, "Telefone deve conter 11 dígitos numéricos")
    .transform((value) => value.replace(/\D/g, "")),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  data_nascimento: z.date(),
  turmaId: z.string().optional(),
})



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

export default function EditStudentForm({ id }: { id: string }) {
  const [availableClasses, setAvailableClasses] = useState<IClass[]>([])
  const [studentClass, setStudentClass] = useState<IClass | null>(null)
  const [student, setStudent] = useState<IStudent>()
  const [file, setFile] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{
    key: string
    url: string
    name: string
  } | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleGetStudent = async () => {
    try {
      const response = await getStudent(id)
      if (response) {
        setStudent(response as IStudent)

        form.setValue("nome", response?.nome)
        form.setValue("email", response?.email)
        form.setValue("cpf", response?.cpf)
        form.setValue("telefone", response?.telefone || "")
        form.setValue("endereco", response?.endereco || "")
        form.setValue("cidade", response?.cidade || "")
        form.setValue("estado", response?.estado || "")
        form.setValue("data_nascimento", response?.data_nascimento)

        const turma = {
          id: response?.turma_id,
          nome: response?.turma_nome,
        }

        setStudentClass(turma as IClass)

        if (response?.caminho_foto !== "/user-images/placeholder.png") {

          if (response.caminho_foto.includes("http")) {
            return
          }

          const responsePhoto = await fetch(
            `/api/images?fileName=${encodeURIComponent(response?.caminho_foto)}`
          )

          if (responsePhoto.ok) {
            const blob = await responsePhoto.blob()
            const url = URL.createObjectURL(blob)
            setUploadedFile({
              key: response?.caminho_foto,
              url: url,
              name: response?.caminho_foto,
            })
          } else {
            showErrorToast("Erro ao carregar a foto do aluno")
          }
        }
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

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


    if (student?.caminho_foto && student?.caminho_foto !== caminho) {
      student.caminho_foto = caminho
    }


    if (!student) {
      return
    }


    const createStudentFormData: IUpdateStudentFormData = {
      data: {
        nome: data.nome,
        email: data.email,
        matricula: student.matricula,
        cpf: data.cpf,
        telefone: data.telefone,
        endereco: data.endereco as string,
        cidade: data.cidade as string,
        estado: data.estado as string,
        data_nascimento: new Date(data.data_nascimento),
        semestre_atual: 1,
        caminho_foto: caminho,
      },
      id: student.id,
    }

    try {
      await updateStudent(createStudentFormData)

      toast({
        title: "Sucesso",
        description: "O aluno foi atualizado com sucesso.",
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
  }

  const handleRemoveClass = async (classId: string) => {
    setStudentClass(null)
    form.setValue("turmaId", "")
  }

  useEffect(() => {
    fetchAvailableClasses()
    handleGetStudent()
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
              <div className="flex items-center justify-center gap-8">
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

                <div className="">
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
                            value={formatCPF(field.value || "")}
                            onChange={(e) => field.onChange(e.target.value)}
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
                            value={formatPhoneNumber(field.value || "")}
                            onChange={(e) => field.onChange(e.target.value)}
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
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  id="data_nascimento"
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}>
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Selecione</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date()}
                                fromYear={2000}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
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
                    {studentClass === null &&
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
                            !field.value || field.value === studentClass
                          }
                          type="button"
                          onClick={() => handleAddClass(field.value!)}>
                          Adicionar
                        </Button>
                      </div>
                    }
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

              <div className="flex w-full items-center justify-end">
                <Button className="mt-8" type="submit" disabled={!form.formState.isValid}>
                  Salvar informações
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
