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
import Image from "next/image"
import { UsersIcon } from "lucide-react"
import Link from "next/link"
import { ICommunityFromBase } from "@/app/models/mongoModels"

interface PageProps {
  data: ICommunityFromBase
}

export function CommunityCard({ data }: PageProps) {
  return (
    <Link
      href={`/comunidades/${data.id}`}
      className="hover:opacity-90 duration-300">
      <Card
        className="w-auto relative aspect-video max-w-80 bg-auto bg-center
                    bg-muted-foreground bg-no-repeat overflow-hidden border-none 
                    bg-clip-content justify-between flex flex-col
                    "
        style={{
          backgroundImage: `url(${
            data.imagem_capa || "/community-images/community-placeholder.png"
          })`,
        }}>
        <div className="absolute inset-0 bg-black opacity-50 rounded-md" />

        <CardHeader
          className="flex flex-row gap-2 items-center justify-between
            relative z-10 px-2 py-1 m-3
           bg-white/30 backdrop-blur-lg rounded-lg">
          <CardTitle className="text-white line-clamp-2">{data.nome}</CardTitle>
          <div className="flex items-center justify-center gap-1 !mt-0">
            <UsersIcon className="text-white h-5" />
            <span>{data.seguidores.length}</span>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 bg-white/30 backdrop-blur-lg px-2 py-1 rounded-lg m-3">
          <CardDescription className="text-gray-200 line-clamp-3">
            {data.descricao}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}
