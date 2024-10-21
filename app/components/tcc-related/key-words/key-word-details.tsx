"use client"

import {
  GetKeyWord,
  IKeyWordDetails,
} from "@/app/server-actions/tcc/getKeyWord"
import { handlePrismaError } from "@/app/utils/handle-error"
import { useEffect, useState } from "react"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "react-day-picker"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface KeyWordProps {
  id: number
}

export function KeyWordDetails({ id }: KeyWordProps) {
  const [keyWord, setKeyWord] = useState<IKeyWordDetails>()
  const router = useRouter()

  const getKeyWord = async (id: number) => {
    try {
      const response = await GetKeyWord(id)

      if (response) {
        setKeyWord(response)
      }
    } catch (error) {
      handlePrismaError(error)
    }
  }

  const handleNavigate = (id: number) => {
    router.push(`/tccs/detalhes?id=${id}`)
  }

  useEffect(() => {
    getKeyWord(id)
  }, [])

  return (
    <div>
      {keyWord && keyWord.tccs && (
        <Card>
          <CardHeader>
            <CardTitle>{keyWord?.palavra}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                Tabela dos TCCs onde a palavra chave {keyWord?.palavra} é
                mencionada
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Título</TableHead>
                  <TableHead className="">Orientador</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keyWord.tccs.map((tcc) => (
                  <TableRow
                    key={tcc.tccId}
                    onClick={() => handleNavigate(tcc.tccId)}
                    className="cursor-default">
                    <TableCell>{tcc.tituloTcc}</TableCell>
                    <TableCell>{tcc.nomeOrientador}</TableCell>
                    <TableCell>{tcc.nomeAluno}</TableCell>
                    <TableCell className="text-center">
                      {tcc.estadoAtual}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
