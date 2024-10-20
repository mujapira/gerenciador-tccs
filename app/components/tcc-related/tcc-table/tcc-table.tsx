"use client"

import { useEffect, useState } from "react"
import { GetStudents } from "../../../server-actions/student/getStudents"

import { tccTableColumns } from "./tcc-col-defs"
import { showErrorToast } from "@/app/utils/toast-utils"

import { ITccDetalhado } from "@/app/models/tcc/tccModel"
import { GetTccsDetails } from "@/app/server-actions/tcc/getTccsDetails"
import { TccDataTable } from "./tcc-data-table"

export function TccTable({ onSelect }: { onSelect: (data: ITccDetalhado) => void }) {
  const [tccs, setTccs] = useState<ITccDetalhado[]>([])

  const handleGetTccs = async () => {
    try {
      const response = await GetTccsDetails()

      console.log(response)

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

  return <TccDataTable columns={tccTableColumns} data={tccs} onRowClick={(row) => onSelect(row)}/>
}
