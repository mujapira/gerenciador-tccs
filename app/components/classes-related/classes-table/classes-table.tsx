"use client"

import { useEffect, useState } from "react"
import { GetStudents } from "../../../server-actions/student/getStudents"
import { IStudent } from "../../../models/student/studentsModel"

import { showErrorToast } from "@/app/utils/toast-utils"
import { ClassesDataTable } from "./classes-data-table"
import { classesTableColumns } from "./classes-col-defs"

export function ClassesTable() {
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

  return <ClassesDataTable columns={classesTableColumns} data={students} />
}
