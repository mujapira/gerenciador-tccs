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
import { ITccDetailed } from "@/app/models/tcc/tccModel"
import { Separator } from "@/components/ui/separator"
import { useSearchParams } from "next/navigation"
import { GetTccsDetails } from "@/app/server-actions/tcc/getTccsDetails"
import { formatDate } from "@/app/utils/date-parser"

export function TccsDetails() {
  const [tccs, setTccs] = useState<ITccDetailed[]>()
  const [selectedTcc, setSelectedTcc] = useState<ITccDetailed | null>(null)
  const [originalTcc, setOriginalTcc] = useState<ITccDetailed | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const searchParams = useSearchParams()
  const paramId = searchParams.get("id")

  const fetchTccs = async () => {
    try {
      console.log(searchParams, paramId)
      const response = await GetTccsDetails()

      if (response) {
        setTccs(response as ITccDetailed[])
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

  const handleDownload = async () => {
    if (!selectedTcc?.documentos || selectedTcc?.documentos.length === 0) {
      showErrorToast("TCC não possui documento para download.")
      return
    }

    const fileName = selectedTcc.documentos[0].caminhoArquivo.split("/").pop()

    if (!fileName) {
      showErrorToast("Nome do arquivo inválido.")
      return
    }

    const response = await fetch(
      `/api/documents?fileName=${encodeURIComponent(fileName)}`
    )

    if (!response.ok) {
      showErrorToast("Erro ao baixar documento.")
      return
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()
    window.URL.revokeObjectURL(url)
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
                  {selectedTcc.documentos &&
                    selectedTcc.documentos.length > 0 && (
                      <Button
                        variant={"default"}
                        onClick={() => handleDownload()}>
                        Fazer download do TCC
                      </Button>
                    )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col text-sm gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold py-4">
                        Informações Gerais
                      </span>
                      <div className="flex items-center">
                        <span>Aluno:&nbsp;</span>
                        <Link href={`/alunos/${selectedTcc.alunoId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.nomeAluno}
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center">
                        <span>Orientador:&nbsp;</span>
                        <Link
                          href={`/orientadores/${selectedTcc.orientadorId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.nomeOrientador}
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center">
                        <span>Turma:&nbsp;</span>
                        <Link href={`/turmas/${selectedTcc.turmaId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.nomeTurma}
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center">
                        <span>Tema:&nbsp;</span>
                        <Link href={`/temas/${selectedTcc.temaId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.tema}
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center">
                        <span>Classificação:&nbsp;</span>
                        <Link
                          href={`/classificacoes/${selectedTcc.classificacaoId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.classificacao}
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-1">
                      <span className="font-semibold py-4">
                        Detalhes do TCC
                      </span>
                      <div className="flex items-center gap-2">
                        <span>Nota Final:</span>
                        <Button
                          variant="invisible"
                          className="px-0 hover:bg-transparent cursor-default py-0 h-5">
                          {selectedTcc.notaFinal}
                        </Button>
                      </div>
                      <div className="flex items-start justify-center flex-col">
                        <span>
                          {selectedTcc.avaliacoes &&
                          selectedTcc.avaliacoes.length > 0
                            ? "Avaliações"
                            : "Não há avaliações"}
                        </span>
                        {selectedTcc.avaliacoes &&
                          selectedTcc.avaliacoes.length > 0 && (
                            <ul className="flex flex-col">
                              {selectedTcc.avaliacoes.map(
                                (avaliacao, index) => (
                                  <li key={index}>
                                    <Link href={`/avaliacoes/${avaliacao.id}`}>
                                      <Button
                                        variant="link"
                                        className="py-0 px-0 h-5">
                                        {avaliacao.nota &&
                                          avaliacao.dataAvaliacao && (
                                            <div className="flex">
                                              <span>&#8226;&nbsp;</span>
                                              {avaliacao.numeroAvaliacao ===
                                                1 && "1ª Avaliação | "}
                                              {avaliacao.numeroAvaliacao ===
                                                2 && "2ª Avaliação | "}
                                              {avaliacao.numeroAvaliacao ===
                                                3 && "3ª Avaliação | "}
                                              <span>
                                                &nbsp; Nota{" "}
                                                {avaliacao.nota.toFixed(2)}
                                                &nbsp;
                                              </span>
                                              <span>|</span>
                                              <span>
                                                &nbsp;
                                                {formatDate(
                                                  avaliacao.dataAvaliacao
                                                )}
                                              </span>
                                            </div>
                                          )}
                                      </Button>
                                    </Link>
                                  </li>
                                )
                              )}
                              {[...Array(3)].map((_, index) => {
                                const avaliacaoExistente =
                                  selectedTcc?.avaliacoes?.find(
                                    (av) => av.numeroAvaliacao === index + 1
                                  )
                                return avaliacaoExistente ? null : (
                                  <Link
                                    href={`/avaliation/new?tccId=${selectedTcc.tccId}`}>
                                    <Button
                                      variant="link"
                                      className="px-0 py-0 h-5">
                                      <span>&#8226;&nbsp;</span>
                                      Avaliação pendente
                                    </Button>
                                  </Link>
                                )
                              })}
                            </ul>
                          )}
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
