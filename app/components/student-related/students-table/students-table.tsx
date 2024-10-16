"use client"

import { useEffect, useState } from "react"
import { GetStudents } from "../../../server-actions/getStudents"
import { IStudent } from "../../../models/studentsModel"
import { DataTable } from "./data-table"
import { studentTableColumns } from "./col-defs"

export function StudentsTable() {
  const [students, setStudents] = useState<IStudent[]>([])

  const handleGetStudents = async () => {
    const response = await GetStudents()

    if (response) {
      setStudents(response)
    }
  }

  useEffect(() => {
    handleGetStudents()
  }, [])

  return <DataTable columns={studentTableColumns} data={students} />
}
