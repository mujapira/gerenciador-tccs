"use client"

import { useEffect, useState } from "react"
import { studentTableColumns } from "./student-col-defs"
import { showErrorToast } from "@/app/utils/toast-utils"
import { StudentDataTable } from "./student-data-table"
import { IStudent } from "@/app/models/mongoModels"
import { getAllStudents } from "@/app/server-actions/mongoActions"

export function StudentsTable() {
  const [students, setStudents] = useState<IStudent[]>([])

  const handleGetStudents = async () => {
    try {
      const response = await getAllStudents()

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

  return <StudentDataTable columns={studentTableColumns} data={students} />
}
