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
import { createStudent } from "@/app/server-actions/createStudent"
import { z } from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IClass } from "@/app/models/classModel"
import { use, useEffect, useState } from "react"
import { GetClasses } from "@/app/server-actions/getClasses"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { INewStudentFormData } from "@/app/models/createStudentModel"
import { useToast } from "@/hooks/use-toast"
import { redirect } from "next/navigation"
import { showErrorToast } from "@/app/utils/toast-utils"

const FormSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  cpf: z.string().min(11, "CPF inválido"),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  data_nascimento: z.date(),
  turmaId: z.string().optional(),
})

export default function NewStudentForm() {
  const [availableClasses, setAvailableClasses] = useState<IClass[]>([])
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const fetchAvailableClasses = async () => {
    const classes = await GetClasses()
    setAvailableClasses(classes)
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const createStudentFormData: INewStudentFormData = {
      nome: data.nome,
      email: data.email,
      matricula: data.matricula,
      cpf: data.cpf,
      telefone: data.telefone,
      endereco: data.endereco,
      cidade: data.cidade,
      estado: data.estado,
      data_ingresso: new Date(Date.now()),
      data_nascimento: new Date(data.data_nascimento),
      semestre_atual: 1,
    }

    try {
      await createStudent(
        createStudentFormData,
        data.turmaId ? parseInt(data.turmaId) : null
      )

      toast({
        title: "Aluno cadastrado com sucesso",
        description: "O aluno foi cadastrado com sucesso.",
        variant: "default",
      })

      redirect("/alunos")
    } catch (error) {
      showErrorToast(error)
    }
  }

  useEffect(() => {
    fetchAvailableClasses()
  }, [])

  return (
    <div>
      <Card className="w-[450px]">
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
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="matricula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="matricula">Matrícula</FormLabel>
                      <Input
                        id="matricula"
                        placeholder="Matrícula"
                        {...field}
                        value={field.value || ""}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="cpf">CPF</FormLabel>
                      <Input
                        id="cpf"
                        placeholder="CPF"
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
                        placeholder="Telefone"
                        {...field}
                        value={field.value || ""}
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
                        <PopoverContent className="w-auto p-0" align="start">
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

              <Separator className="my-4" />

              <CardDescription>
                Selecione a sala de aula que o aluno será matriculado.
              </CardDescription>

              <FormField
                control={form.control}
                name="turmaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="turma">Turma</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a Turma" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClasses.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="mt-8" type="submit">
                Cadastrar Aluno
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
