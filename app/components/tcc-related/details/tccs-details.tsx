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

import { Separator } from "@/components/ui/separator"
import { useSearchParams } from "next/navigation"

import { formatDate } from "@/app/utils/date-parser"
import { ITcc } from "@/app/models/mongoModels"
import { getAllTccs, getTccDetails } from "@/app/server-actions/mongoActions"

export function TccsDetails() {
  const [tccs, setTccs] = useState<ITcc[]>()
  const [selectedTcc, setSelectedTcc] = useState<ITcc | null>(null)
  const [originalTcc, setOriginalTcc] = useState<ITcc | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const searchParams = useSearchParams()
  const paramId = searchParams.get("id")



  const handleDownload = async () => {
    if (!selectedTcc?.documentos || selectedTcc?.documentos.length === 0) {
      showErrorToast("TCC não possui documento para download.")
      return
    }

    const fileName = selectedTcc.documentos[0].caminho.split("/").pop()

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
              selected={selectedTcc ? selectedTcc.id : null}
              onSelect={(tcc) => setSelectedTcc(tcc)}
            />
            {selectedTcc && (
              <Card className="w-auto mt-4">
                <CardHeader className="flex flex-row gap-2 items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <CardTitle>TCC: {selectedTcc.titulo}</CardTitle>

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
                        <Link href={`/alunos/${selectedTcc.aluno.id}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.aluno.nome}
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center">
                        <span>Orientador:&nbsp;</span>
                        <Link
                          href={`/orientadores/${selectedTcc.orientador.id}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.orientador.nome}
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center">
                        <span>Turma:&nbsp;</span>
                        <Link href={`/turmas/${selectedTcc.aluno.turma_id}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.aluno.turma_nome}
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center">
                        <span>Tema:&nbsp;</span>
                        <Link href={`/temas/${selectedTcc.tema.id}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.tema.descricao}
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center">
                        <span>Classificação:&nbsp;</span>
                        <Link
                          href={`/classificacoes/${selectedTcc.classificacao.id}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc.classificacao.descricao}
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-1">
                      <span className="font-semibold py-4">
                        Detalhes do TCC
                      </span>
                      {selectedTcc.avaliacoes.length > 2 && (
                        <div className="flex items-center gap-2">
                          <span>Nota Final:</span>
                          <Button
                            variant="invisible"
                            className="px-0 hover:bg-transparent cursor-default py-0 h-5">
                            {selectedTcc.notaFinal?.toFixed(2) || "Não avaliado"}
                          </Button>
                        </div>
                      )}
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
                                    <Link href={`/avaliacoes/${avaliacao.numero}`}>
                                      <Button
                                        variant="link"
                                        className="py-0 px-0 h-5">
                                        {avaliacao.nota &&
                                          avaliacao.data_avaliacao && (
                                            <div className="flex">
                                              <span>&#8226;&nbsp;</span>
                                              {avaliacao.numero ===
                                                1 && "1ª Avaliação | "}
                                              {avaliacao.numero ===
                                                2 && "2ª Avaliação | "}
                                              {avaliacao.numero ===
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
                                                  avaliacao.data_avaliacao
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
                                    (av) => av.numero === index + 1
                                  )
                                return avaliacaoExistente ? null : (
                                  <Link
                                    key={index}
                                    href={`/avaliation/new?tccId=${selectedTcc.id}`}>
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

                    {selectedTcc.palavras_chave && (
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold">Palavras-chave</span>
                        <div className="flex flex-wrap gap-1 items-center">
                          {selectedTcc.palavras_chave.map(
                            (palavraChave, index) => (
                              <Fragment key={index}>
                                <Link
                                  href={`/palavras-chave/${palavraChave.id}`}>
                                  <Button variant="link" className="px-0">
                                    {palavraChave.palavra}
                                    {selectedTcc.palavras_chave &&
                                      index <
                                      selectedTcc.palavras_chave.length -
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
