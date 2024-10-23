"use client"

import { useEffect, useState } from "react"
import { showErrorToast } from "@/app/utils/toast-utils"
import { AvaliationDataTable } from "./avaliations-data-table"
import { avaliationTableColumns } from "./avaliations-col-defs"
import { GetTccsDetails } from "@/app/server-actions/tcc/getTccsDetails"
import { ITccDetailed } from "@/app/models/tcc/tccModel"

export function AvaliationTable({
  onSelect,
}: {
  onSelect: (data: ITccDetailed) => void
}) {
  const [target, setTarget] = useState<ITccDetailed[]>([])

  const handleGetTarget = async () => {
    try {
      const response = await GetTccsDetails()

      if (response) {
        setTarget(response)
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

  useEffect(() => {
    handleGetTarget()
  }, [])

  return (
    <AvaliationDataTable
      columns={avaliationTableColumns}
      data={target}
      onRowClick={(row) => onSelect(row)}
    />
  )
}
