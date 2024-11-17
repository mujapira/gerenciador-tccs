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
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { showErrorToast } from "@/app/utils/toast-utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { EmptyCard } from "../../empty-card"
import Image from "next/image"
import { IClass, ICreateTeacherFormData } from "@/app/models/mongoModels"
import { createOrientador, getClasses } from "@/app/server-actions/mongoActions"

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
  departamento: z.string().min(2, "Departamento é obrigatório"),
  titulo_academico: z.string().min(2, "Título acadêmico é obrigatório"),
})

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

export default function NewTeacherForm() {
  const [availableClasses, setAvailableClasses] = useState<IClass[]>([])
  const [studentClasses, setStudentClasses] = useState<IClass[]>([])
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

    const createStudentFormData: ICreateTeacherFormData = {
      nome: data.nome,
      email: data.email,
      cpf: data.cpf,
      telefone: data.telefone,
      departamento: data.departamento,
      titulo_academico: data.titulo_academico,
      caminho_foto: caminho,
    }

    try {
      await createOrientador(createStudentFormData)

      toast({
        title: "Orientador cadastrado com sucesso",
        description: "O orientador foi cadastrado com sucesso.",
        variant: "default",
      })

      router.push("/orientadores")
    } catch (error) {
      showErrorToast(error)
    }
  }

  useEffect(() => {
    fetchAvailableClasses()
  }, [])

  return (
    <div>
      <Card className="w-auto">
        <CardHeader>
          <CardTitle>Informações do novo orientador</CardTitle>
          <CardDescription>
            Informe os dados do novo orientador para cadastrá-lo no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full gap-2 flex flex-col">
              <div className="flex items-start justify-center gap-8">
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
                        <FormItem>
                          <FormLabel htmlFor="departamento">
                            Departamento
                          </FormLabel>
                          <Input
                            id="departamento"
                            placeholder="departamento"
                            {...field}
                            value={field.value || ""}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="titulo_academico"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="titulo_academico">
                            Título acadêmico
                          </FormLabel>
                          <Input
                            id="titulo_academico"
                            placeholder="Título Academico"
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

              <Button className="mt-8" type="submit">
                Cadastrar Orientador
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
