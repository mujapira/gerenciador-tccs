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
import { IClass, IStudent, ITeacher, IUpdateStudentFormData, IUpdateTeacherFormData } from "@/app/models/mongoModels"
import { getClasses, getOrientador, getStudent, updateOrientador, updateStudent } from "@/app/server-actions/mongoActions"
import { formatCPF, formatPhoneNumber } from "@/app/utils/formatters"

const titles = [
  "Doutor",
  "Mestre",
  "Especialista",
]

const departamentos = [
  "Ciências da Computação",
  "Engenharia Elétrica",
  "Matemática",
  "Física",
  "Química",
];

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
  departamento: z.string().min(2, "Departamento é obrigatório"),
  titulo_academico: z.string().min(2, "Título acadêmico é obrigatório"),
})


export default function EditTeacherForm({ id }: { id: string }) {

  const [student, setStudent] = useState<ITeacher>()
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
      const response = await getOrientador(id)
      if (response) {
        setStudent(response as ITeacher)

        form.setValue("nome", response?.nome)
        form.setValue("email", response?.email)
        form.setValue("cpf", response?.cpf)
        form.setValue("telefone", response?.telefone || "")
        form.setValue("departamento", response?.departamento || "")
        form.setValue("titulo_academico", response?.titulo_academico || "")

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
    mode: "onChange"
  })

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

    const createStudentFormData: IUpdateTeacherFormData = {
      data: {
        nome: data.nome,
        email: data.email,
        cpf: data.cpf,
        telefone: data.telefone,
        departamento: data.departamento,
        titulo_academico: data.titulo_academico,
        caminho_foto: caminho,
      },
      id: student.id,
    }

    try {
      await updateOrientador(createStudentFormData)

      toast({
        title: "Sucesso",
        description: "O aluno foi atualizado com sucesso.",
        variant: "default",
      })

      router.push("/orientadores")
    } catch (error) {
      showErrorToast(error)
    }
  }

  useEffect(() => {
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
              className="w-full gap-8 flex flex-col">
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

                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem className="w-full flex flex-col gap-0">
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
                        <FormItem className="w-full flex flex-col gap-0">
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
                        <FormItem className="w-full flex flex-col gap-0">
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
                        <FormItem >
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
                  </div>
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="departamento"
                      render={({ field }) => (
                        <FormItem className="w-full flex flex-col gap-0">
                          <FormLabel htmlFor="departamento">Departamento</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value || ""}
                          >
                            <SelectTrigger id="departamento">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {departamentos.map((departamento) => (
                                <SelectItem key={departamento} value={departamento}>
                                  {departamento}
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
                      name="titulo_academico"
                      render={({ field }) => (
                        <FormItem className="w-full flex flex-col gap-0">
                          <FormLabel htmlFor="titulo_academico">Título Acadêmico</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value || ""}
                          >
                            <SelectTrigger id="titulo_academico">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {titles.map((title) => (
                                <SelectItem key={title} value={title}>
                                  {title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                </div>
              </div>

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
