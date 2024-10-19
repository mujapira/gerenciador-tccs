"use client"

import { useEffect, useState } from "react"
import { showErrorToast } from "@/app/utils/toast-utils"
import { ClassesDataTable } from "./classes-data-table"
import { classesTableColumns } from "./classes-col-defs"
import { IClassWithStudents } from "@/app/models/classes/classModel"
import { GetClassesDetails } from "@/app/server-actions/classes/getClassesDetails"

export function ClassesTable({ onSelectClass }: { onSelectClass: (classData: IClassWithStudents) => void }) {
  const [classes, setClasses] = useState<IClassWithStudents[]>([])

  const handleGetClasses = async () => {
    try {
      const response = await GetClassesDetails()

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
