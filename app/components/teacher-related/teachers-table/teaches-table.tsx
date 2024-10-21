"use client"

import { useEffect, useState } from "react"
import { teacherTableColumns } from "./teachers-col-defs"
import { showErrorToast } from "@/app/utils/toast-utils"
import { TeachersDataTable } from "./teachers-data-table"
import { GetTeachers } from "@/app/server-actions/teachers/getTeachers"
import { ITeacher } from "@/app/models/teacher/teacherModel"

export function TeachersTable() {
  const [ent, setEnt] = useState<ITeacher[]>([])

  const handleGetTeacher = async () => {
    try {
      const response = await GetTeachers()

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
