"use client"

import { Fragment, useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { showErrorToast, showSuccessToast } from "@/app/utils/toast-utils"
import { Separator } from "@/components/ui/separator"
import { AvaliationTable } from "./avaliations-table/avaliations-table"
import { ITccAvaliation, ITccDetailed } from "@/app/models/tcc/tccModel"
import { GetTccsDetails } from "@/app/server-actions/tcc/getTccsDetails"
import { Table } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AddNewAvaliation } from "@/app/server-actions/tcc/addNewAvaliation"
import { Toast } from "@radix-ui/react-toast"
import { toast } from "@/hooks/use-toast"

interface EditingState {
  isEditing: boolean
  avaliacaoId: number
}
interface NewAvaliacaoData {
  numeroAvaliacao: number
  nota: number | null
  dataAvaliacao: string
  descricao: string
}
export function AvaliationsDetails() {
  const [tccList, setTccList] = useState<ITccDetailed[]>()
  const [selectedTcc, setSelectedTcc] = useState<ITccDetailed | null>(null)
  const [isEditing, setIsEditing] = useState<EditingState>({
    isEditing: false,
    avaliacaoId: 0,
  })

  const [newAvaliacaoData, setNewAvaliacaoData] = useState<NewAvaliacaoData>({
    numeroAvaliacao: 0,
    nota: null,
    dataAvaliacao: "",
    descricao: "",
  })

  const handleAddAvaliacao = (numeroAvaliacao: number) => {
    setNewAvaliacaoData({
      numeroAvaliacao,
      nota: null,
      dataAvaliacao: new Date().toISOString().split("T")[0],
      descricao: "",
    })
    setIsEditing({ isEditing: true, avaliacaoId: numeroAvaliacao })
  }

  async function handleSaveNewAvaliacao() {
    try {
      if (!selectedTcc) return
      if (!newAvaliacaoData.nota) return showErrorToast("Nota é obrigatória.")
      if (!newAvaliacaoData.dataAvaliacao)
        return showErrorToast("Data é obrigatória.")
      if (!newAvaliacaoData.descricao)
        return showErrorToast("Descrição é obrigatória.")

      await AddNewAvaliation({
        numeroAvaliacao: newAvaliacaoData.numeroAvaliacao,
        nota: newAvaliacaoData.nota,
        dataAvaliacao: new Date(newAvaliacaoData.dataAvaliacao),
        descricao: newAvaliacaoData.descricao,
        tccId: selectedTcc.tccId,
        orientadorId: selectedTcc.orientadorId,
      })

      Toast({ content: "Avaliação salva com sucesso!" })
      setIsEditing({ isEditing: false, avaliacaoId: 0 })

      fetchTccs()
    } catch (error) {
      showErrorToast("Erro ao salvar avaliação.")
    }
  }

  const handleCancel = (avaliacaoId: number) => {
    setNewAvaliacaoData({
      numeroAvaliacao: 0,
      nota: null,
      dataAvaliacao: "",
      descricao: "",
    })
    setIsEditing({ isEditing: false, avaliacaoId: 0 })
  }

  const fetchTccs = async () => {
    try {
      const response = await GetTccsDetails()
      if (response) {
        setTccList(response)
      }
    } catch (error) {
      showErrorToast("Erro ao buscar avaliações.")
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
            <AvaliationTable onSelect={(tcc) => setSelectedTcc(tcc)} />
            {selectedTcc ? (
              <Card className="w-auto mt-4">
                <CardHeader className="flex flex-row gap-2 items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <CardTitle>TCC: {selectedTcc?.tituloTcc}</CardTitle>
                    <CardDescription>
                      {isEditing
                        ? "Editando detalhes do TCC"
                        : "Visualizando detalhes do TCC"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col text-sm gap-4">
                    <div className="flex flex-col gap-1 pb-4">
                      <span className="font-semibold py-4">
                        Avaliações do TCC
                      </span>
                      {selectedTcc?.avaliacoes &&
                      selectedTcc?.avaliacoes.length > 0 ? (
                        <Table className="min-w-full borde">
                          <thead className="">
                            <tr>
                              <th className="p-2">Num</th>
                              <th className="p-2">Nota</th>
                              <th className="p-2 text-start">Data</th>
                              <th className="p-2 text-start">Descrição</th>
                            </tr>
                          </thead>
                          <tbody className="">
                            {selectedTcc?.avaliacoes.map(
                              (avaliacao: ITccAvaliation, index: number) => (
                                <tr
                                  key={index}
                                  className={
                                    index !==
                                    (selectedTcc?.avaliacoes?.length ?? 0) - 1
                                      ? "border-b"
                                      : ""
                                  }>
                                  <td className="p-2 text-center">
                                    {avaliacao.numeroAvaliacao}
                                  </td>
                                  <td className="p-2 text-center">
                                    {avaliacao.nota}
                                  </td>
                                  <td className="p-2 text-start">
                                    {new Date(
                                      avaliacao.dataAvaliacao
                                    ).toLocaleDateString("pt-BR")}
                                  </td>
                                  <td className="p-2">{avaliacao.descricao}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </Table>
                      ) : (
                        <span className="text-muted-foreground">
                          Nenhuma avaliação cadastrada
                        </span>
                      )}
                      {selectedTcc && (
                        <div className="flex gap-2 mt-4">
                          {[...Array(3)].map((_, index) => {
                            const avaliacaoExistente =
                              selectedTcc?.avaliacoes?.find(
                                (av) => av.numeroAvaliacao === index + 1
                              )
                            return avaliacaoExistente ? null : (
                              <Button
                                disabled={
                                  isEditing.isEditing &&
                                  index + 1 !== isEditing.avaliacaoId
                                }
                                key={index}
                                onClick={() => handleAddAvaliacao(index + 1)}
                                className="w-full">
                                Inserir Avaliação {index + 1}
                              </Button>
                            )
                          })}
                        </div>
                      )}

                      {isEditing.isEditing && (
                        <div className="flex flex-col mt-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Nota"
                              onChange={(e) =>
                                setNewAvaliacaoData({
                                  ...newAvaliacaoData,
                                  nota: Number(e.target.value),
                                })
                              }
                              className="mb-2 w-14"
                            />
                            <Input
                              type="date"
                              placeholder="Data de Avaliação"
                              value={newAvaliacaoData.dataAvaliacao}
                              onChange={(e) =>
                                setNewAvaliacaoData({
                                  ...newAvaliacaoData,
                                  dataAvaliacao: e.target.value,
                                })
                              }
                              className="mb-2 w-auto"
                            />
                          </div>
                          <Textarea
                            placeholder="Descrição da Avaliação"
                            onChange={(e) =>
                              setNewAvaliacaoData({
                                ...newAvaliacaoData,
                                descricao: e.target.value,
                              })
                            }
                            className="mb-4"
                          />
                          <div className="flex gap-2 w-full items-center justify-end">
                            <Button
                              variant={"outline"}
                              onClick={() =>
                                handleCancel(isEditing.avaliacaoId)
                              }>
                              Cancelar
                            </Button>
                            <Button onClick={() => handleSaveNewAvaliacao()}>
                              Salvar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-1">
                      <span className="font-semibold py-4">
                        Informações Gerais
                      </span>
                      <div className="flex items-center gap-2">
                        <span>Aluno:</span>
                        <Link href={`/alunos/${selectedTcc?.alunoId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc?.nomeAluno}
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Orientador:</span>
                        <Link
                          href={`/orientadores/${selectedTcc?.orientadorId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc?.nomeOrientador}
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Turma:</span>
                        <Link href={`/turmas/${selectedTcc?.turmaId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc?.nomeTurma}
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
                        <span>Tema: </span>
                        <Link href={`/temas/${selectedTcc?.temaId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc?.tema}
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Classificação:</span>
                        <Link
                          href={`/classificacoes/${selectedTcc?.classificacaoId}`}>
                          <Button variant="link" className="px-0 py-0 h-5">
                            {selectedTcc?.classificacao}
                          </Button>
                        </Link>
                      </div>
                      {selectedTcc?.palavrasChave && (
                        <div className="flex gap-2">
                          <span className="">Palavras-chave:</span>
                          <div className="flex flex-wrap gap-1 items-center">
                            {selectedTcc?.palavrasChave.map(
                              (palavraChave, index) => (
                                <Fragment key={index}>
                                  <Link
                                    href={`/palavras-chave/${palavraChave.id}`}>
                                    <Button
                                      variant="link"
                                      className="px-0 py-0 h-5">
                                      {palavraChave.palavra}
                                      {selectedTcc?.palavrasChave &&
                                        index <
                                          selectedTcc?.palavrasChave.length -
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

                    <Separator />
                  </div>
                </CardContent>
              </Card>
            ) : (
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
