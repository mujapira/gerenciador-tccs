"use client"

import { useEffect, useState } from "react"
import { showErrorToast } from "@/app/utils/toast-utils"
import { ClassesDataTable } from "./classes-data-table"
import { classesTableColumns } from "./classes-col-defs"
import { IClass } from "@/app/models/mongoModels"
import { getClasses } from "@/app/server-actions/mongoActions"


export function ClassesTable({ onSelectClass }: { onSelectClass: (classData: IClass) => void }) {
  const [classes, setClasses] = useState<IClass[]>([])

  const handleGetClasses = async () => {
    try {
      const response = await getClasses()
      console.log(response)
      if (response) {
        setClasses(response)
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

  useEffect(() => {
    handleGetClasses()
  }, [])

  return <ClassesDataTable columns={classesTableColumns} data={classes} onRowClick={(row) => onSelectClass(row)} />
}
