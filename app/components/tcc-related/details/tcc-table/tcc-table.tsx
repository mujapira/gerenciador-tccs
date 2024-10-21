"use client"

import { useEffect, useState } from "react"

import { tccTableColumns } from "./tcc-col-defs"
import { showErrorToast } from "@/app/utils/toast-utils"

import { ITccDetalhado } from "@/app/models/tcc/tccModel"
import { GetTccsDetailsMaurico } from "@/app/server-actions/tcc/getTccsDetailsMaurico"
import { TccDataTable } from "./tcc-data-table"

export function TccTable({ onSelect, selected }: { onSelect: (data: ITccDetalhado) => void, selected: number | null}) {
  const [tccs, setTccs] = useState<ITccDetalhado[]>([])

  const handleGetTccs = async () => {
    try {
      const response = await GetTccsDetailsMaurico()

      if (response) {
        setTccs(response)
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

  useEffect(() => {
    handleGetTccs()
  }, [])

  return <TccDataTable selected={selected} columns={tccTableColumns} data={tccs} onRowClick={(row) => onSelect(row)}/>
}
