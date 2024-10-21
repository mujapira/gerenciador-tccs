"use client";

import { Fragment, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { showErrorToast } from "@/app/utils/toast-utils";

import { TccTable } from "../details/tcc-table/tcc-table";
import AvaliationForm from "./avaliation-form";
import { ITccDetalhado } from "@/app/models/tcc/tccModel";
import { GetTccsDetails } from "@/app/server-actions/tcc/getTccsDetails";

export function TccsAvaliations() {
  const [tccs, setTccs] = useState<ITccDetalhado[]>();
  const [selectedTcc, setSelectedTcc] = useState<ITccDetalhado | null>(null);

  const fetchTccs = async () => {
    try {
      const response = await GetTccsDetails();

      if (response) {
        setTccs(response as ITccDetalhado[]);
      }
    } catch (error) {
      showErrorToast("Erro ao buscar TCCs.");
    }
  };

  useEffect(() => {
    console.log(selectedTcc);
  }, [selectedTcc]);

  useEffect(() => {
    fetchTccs();
  }, []);

  return (
    <div className="flex w-full gap-6 items-start justify-start">
      <div className="flex flex-col gap-2">
        <Card className="w-auto">
          <CardHeader className="flex flex-row gap-2 items-center justify-between">
            <div className="flex flex-col">
              <CardTitle>Informações dos TCCs</CardTitle>
              <CardDescription>
                Dados gerais dos TCCs cadastrados no sistema
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <TccTable onSelect={(tcc) => setSelectedTcc(tcc)} selected={null} />
            {selectedTcc && (
              <Card className="w-auto mt-4">
                <CardHeader className="flex flex-row gap-2 items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <CardTitle>TCC: {selectedTcc.tituloTcc}</CardTitle>

                    <CardDescription>
                      Visualizando as avaliações do TCC
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <AvaliationForm
                    avaliations={selectedTcc.avaliacoes ?? null}
                  />
                </CardContent>
              </Card>
            )}
            {!selectedTcc && (
              <Card className="w-auto mt-4">
                <CardHeader className="flex flex-row gap-2 items-center justify-between">
                  <div className="flex flex-col">
                    <CardTitle>Detalhes do TCC</CardTitle>
                    <CardDescription>
                      Selecione um TCC para visualizar as avaliações
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
