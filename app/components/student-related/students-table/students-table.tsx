"use client"

import { useEffect, useState } from "react"
import { GetStudents } from "../../../server-actions/getStudents"
import { IStudent } from "../../../models/studentsModel"
import { DataTable } from "./data-table"
import { studentTableColumns } from "./col-defs"
import { showErrorToast } from "@/app/utils/toast-utils"

export function StudentsTable() {
  const [students, setStudents] = useState<IStudent[]>([])

  const handleGetStudents = async () => {
    try {
      const response = await GetStudents()

      if (response) {
        setStudents(response)
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

  useEffect(() => {
    handleGetStudents()
  }, [])

  return <DataTable columns={studentTableColumns} data={students} />
}
