"use client"

import { useEffect, useState } from "react"
import { GetStudents } from "../../../server-actions/getStudents"
import { IUser } from "../../../models/userModel"
import { DataTable } from "../../data-table"
import { studentTableColumns } from "./col-defs"

export function StudentsTable() {
  const [students, setStudents] = useState<IUser[]>([])

  const handleGetStudents = async () => {
    const response = await GetStudents()

    if (response) {
      setStudents(response)
    }
  }

  useEffect(() => {
    handleGetStudents()
  }, [])

  return (
    <div>
      <DataTable columns={studentTableColumns} data={students} />
    </div>
  )
}
