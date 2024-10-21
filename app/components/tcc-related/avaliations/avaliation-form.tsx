"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/app/utils/toast-utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { ITccAvaliation } from "@/app/models/tcc/avaliationModel";
import { IInsertAvaliationModel } from "@/app/models/tcc/InsertAvaliationModel";
import { createAvaliation } from "@/app/server-actions/tcc/avaliations/createAvaliation";

interface AvaliationFormProps {
  avaliations: ITccAvaliation[] | null;
}

const FormSchema = z.object({
  nota1: z
    .number()
    .min(0, { message: "A nota mínima é 0" })
    .max(10, { message: "A nota máxima é 10" })
    .optional(),
  descricao1: z.string().optional(),
  nota2: z
    .number()
    .min(0, { message: "A nota mínima é 0" })
    .max(10, { message: "A nota máxima é 10" })
    .optional(),
  descricao2: z.string().optional(),
  nota3: z
    .number()
    .min(0, { message: "A nota mínima é 0" })
    .max(10, { message: "A nota máxima é 10" })
    .optional(),
  descricao3: z.string().optional(),
});

export default function AvaliationForm({ avaliations }: AvaliationFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function setInitialAvaliations() {
    avaliations?.forEach((avaliation, index) => {
      switch (avaliation.numero_avaliacao) {
        case 1:
          form.setValue(
            "nota1",
            avaliation.nota ? Number(avaliation.nota) : undefined
          ); // Converte Decimal para number
          form.setValue("descricao1", avaliation.descricao);
          break;
        case 2:
          form.setValue(
            "nota2",
            avaliation.nota ? Number(avaliation.nota) : undefined
          ); // Converte Decimal para number
          form.setValue("descricao2", avaliation.descricao);
          break;
        case 3:
          form.setValue(
            "nota3",
            avaliation.nota ? Number(avaliation.nota) : undefined
          ); // Converte Decimal para number
          form.setValue("descricao3", avaliation.descricao);
          break;
        default:
          break;
      }
    });
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (!avaliations || avaliations?.length <= 0) {
        return;
      }

      const nota1: IInsertAvaliationModel = {
        tcc_id: avaliations[0]?.tcc_id,
        orientador_id: avaliations[0]?.orientador_id,
        data_avaliacao: new Date(),
        descricao: data.descricao1 ?? "",
        nota: data.nota1 ?? null,
        numero_avaliacao: 1,
      };

      const nota2: IInsertAvaliationModel = {
        tcc_id: avaliations[0]?.tcc_id,
        orientador_id: avaliations[0]?.orientador_id,
        data_avaliacao: new Date(),
        descricao: data.descricao2 ?? "",
        nota: data.nota2 ?? null,
        numero_avaliacao: 2,
      };

      const nota3: IInsertAvaliationModel = {
        tcc_id: avaliations[0]?.tcc_id,
        orientador_id: avaliations[0]?.orientador_id,
        data_avaliacao: new Date(),
        descricao: data.descricao3 ?? "",
        nota: data.nota3 ?? null,
        numero_avaliacao: 3,
      };

      if (!nota1.nota) await createAvaliation(nota1);

      if (!nota2.nota) await createAvaliation(nota2);

      if (!nota3.nota) await createAvaliation(nota3);

      toast({
        title: "Aluno cadastrado com sucesso",
        description: "O aluno foi cadastrado com sucesso.",
        variant: "default",
      });

      //router.push("/alunos");
    } catch (error) {
      showErrorToast(error);
    }
  }
  useEffect(() => {
    form.reset();
    form.setValue("nota1", undefined);
    form.setValue("descricao1", "");

    form.setValue("nota2", 0);
    form.setValue("descricao2", "");

    form.setValue("nota3", 0);
    form.setValue("descricao3", "");

    setInitialAvaliations();
  }, [avaliations]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full gap-2 flex flex-col"
      >
        <div className="flex-col flex gap-4">
          <div className="flex flex-col text-sm gap-4">
            <span className="font-semibold py-3">Primeira Avaliação</span>
            <div className="flex gap-2 flex-col">
              <div className="max-w-[60px]">
                <FormField
                  control={form.control}
                  name="nota1"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        placeholder="Nota"
                        id="nota1"
                        {...field}
                        value={field.value || undefined}
                        onChange={(e) => {
                          let value = Number(e.target.value);
                          if (value > 10) value = 10;
                          if (value < 0) value = 0;
                          field.onChange(value);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="descricao1"
                  render={({ field }) => (
                    <FormItem>
                      <Textarea
                        placeholder="Descrição"
                        id="descricao1"
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
          <Separator />
          <div className="flex flex-col text-sm gap-4">
            <span className="font-semibold py-3">Segunda Avaliação</span>
            <div className="flex gap-2 flex-col">
              <div className="max-w-[60px]">
                <FormField
                  control={form.control}
                  name="nota2"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        placeholder="Nota"
                        id="nota2"
                        {...field}
                        value={field.value || undefined}
                        onChange={(e) => {
                          let value = Number(e.target.value);
                          if (value > 10) value = 10;
                          if (value < 0) value = 0;
                          field.onChange(value);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="descricao2"
                  render={({ field }) => (
                    <FormItem>
                      <Textarea
                        placeholder="Descrição"
                        id="descricao2"
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
          <Separator />
          <div className="flex flex-col text-sm gap-4">
            <span className="font-semibold py-3">Terceira Avaliação</span>
            <div className="flex gap-2 flex-col">
              <div className="max-w-[60px]">
                <FormField
                  control={form.control}
                  name="nota3"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        placeholder="Nota"
                        id="nota3"
                        {...field}
                        value={field.value || undefined}
                        onChange={(e) => {
                          let value = Number(e.target.value);
                          if (value > 10) value = 10;
                          if (value < 0) value = 0;
                          field.onChange(value);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="descricao3"
                  render={({ field }) => (
                    <FormItem>
                      <Textarea
                        placeholder="Descrição"
                        id="descricao3"
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
          <Button className="mt-8" type="submit">
            Cadastrar Avaliações
          </Button>
        </div>
      </form>
    </Form>
  );
}
