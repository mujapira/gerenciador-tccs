"use client"

import { useEffect, useState } from "react"
import { teacherTableColumns } from "./teachers-col-defs"
import { showErrorToast } from "@/app/utils/toast-utils"
import { TeachersDataTable } from "./teachers-data-table"
import { ITeacher } from "@/app/models/mongoModels"
import { getAllOrientadores } from "@/app/server-actions/mongoActions"

export function TeachersTable() {
  const [ent, setEnt] = useState<ITeacher[]>([])

  const handleGetTeacher = async () => {
    try {
      const response = await getAllOrientadores()

      if (response) {
        setEnt(response)
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

  useEffect(() => {
    handleGetTeacher()
  }, [])

  return <TeachersDataTable columns={teacherTableColumns} data={ent} />
}
