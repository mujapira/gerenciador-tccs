"use client"

import { useEffect, useState } from "react"
import { GetStudents } from "../../../server-actions/student/getStudents"
import { IStudent } from "../../../models/student/studentsModel"

import { studentTableColumns } from "./student-col-defs"
import { showErrorToast } from "@/app/utils/toast-utils"
import { StudentDataTable } from "./student-data-table"

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

  return <StudentDataTable columns={studentTableColumns} data={students} />
}
