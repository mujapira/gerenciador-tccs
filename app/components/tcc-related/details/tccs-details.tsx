"use client"

import { Fragment, useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import { showErrorToast } from "@/app/utils/toast-utils"

import { TccTable } from "./tcc-table/tcc-table"
import { ITccDetalhado } from "@/app/models/tcc/tccModel"
import { GetTccsDetailsMaurico } from "@/app/server-actions/tcc/getTccsDetailsMaurico"
import { Separator } from "@/components/ui/separator"
import { useSearchParams } from "next/navigation"

export function TccsDetails() {
  const [tccs, setTccs] = useState<ITccDetalhado[]>()
  const [selectedTcc, setSelectedTcc] = useState<ITccDetalhado | null>(null)
  const [originalTcc, setOriginalTcc] = useState<ITccDetalhado | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const searchParams = useSearchParams()
  const paramId = searchParams.get("id")

  const fetchTccs = async () => {
    try {
      console.log(searchParams, paramId)
      const response = await GetTccsDetailsMaurico()

      if (response) {
        setTccs(response as ITccDetalhado[])
      }

      if (paramId) {
        console.log("paramId", paramId)

        const selected = response.find((tcc) => tcc.tccId === Number(paramId))
        if (selected) {
          setSelectedTcc(selected)
        }
      }
    } catch (error) {
      showErrorToast("Erro ao buscar TCCs.")
    }
  }

  useEffect(() => {
    fetchTccs()
  }, [])

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
            <TccTable
              selected={selectedTcc ? selectedTcc.tccId : null}
              onSelect={(tcc) => setSelectedTcc(tcc)}
            />
            {selectedTcc && (
              <Card className="w-auto mt-4">
                <CardHeader className="flex flex-row gap-2 items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <CardTitle>TCC: {selectedTcc.tituloTcc}</CardTitle>

                    <CardDescription>
                      {isEditing
                        ? "Editando detalhes do TCC"
                        : "Visualizando detalhes do TCC"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col text-sm gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold py-4">
                        Informações Gerais
                      </span>
                      <div className="flex items-center gap-2">
                        <span>Aluno:</span>
                        <Link href={`/alunos/${selectedTcc.alunoId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.nomeAluno}
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Orientador:</span>
                        <Link
                          href={`/orientadores/${selectedTcc.orientadorId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.nomeOrientador}
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Turma:</span>
                        <Link href={`/turmas/${selectedTcc.turmaId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.nomeTurma}
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-1">
                      <span className="font-semibold py-4">
                        Detalhes do TCC
                      </span>
                      <div className="flex items-center">
                        <span>Tema:</span>
                        <Link href={`/temas/${selectedTcc.temaId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.tema}
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Classificação:</span>
                        <Link
                          href={`/classificacoes/${selectedTcc.classificacaoId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.classificacao}
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Nota Final:</span>
                        <Button
                          variant="invisible"
                          className="px-0 hover:bg-transparent cursor-default py-0 h-5">
                          {selectedTcc.notaFinal}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Número de Avaliações:</span>
                        <Link href={`/avaliacoes/${selectedTcc.tccId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.numeroAvaliacoes}
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <Separator />

                    {selectedTcc.palavrasChave && (
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold">Palavras-chave</span>
                        <div className="flex flex-wrap gap-1 items-center">
                          {selectedTcc.palavrasChave.map(
                            (palavraChave, index) => (
                              <Fragment key={index}>
                                <Link
                                  href={`/palavras-chave/${palavraChave.id}`}>
                                  <Button variant="link" className="px-0">
                                    {palavraChave.palavra}
                                    {selectedTcc.palavrasChave &&
                                      index <
                                        selectedTcc.palavrasChave.length -
                                          1 && <span>,</span>}
                                  </Button>
                                </Link>
                              </Fragment>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            {!selectedTcc && (
              <Card className="w-auto mt-4">
                <CardHeader className="flex flex-row gap-2 items-center justify-between">
                  <div className="flex flex-col">
                    <CardTitle>Detalhes do TCC</CardTitle>
                    <CardDescription>
                      Selecione um TCC para visualizar os detalhes
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
