"use client"

import { useEffect } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CommunityDetails() {

  

  useEffect(() => {}, [])

  return (
    <div className="flex w-full gap-6 items-start justify-start">
      <div className="flex flex-col gap-2">
        <Card className="w-auto">
          <CardHeader className="flex flex-row gap-2 items-center justify-between">
            <div className="flex flex-col">
              <CardTitle>Informações das turmas</CardTitle>
              <CardDescription>
                Dados gerais das turmas cadastradas no sistema
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
    </div>
  )
}
