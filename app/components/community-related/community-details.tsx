"use client"

import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GetCommunityDetails } from "@/app/server-actions/community/getCommunityDetails"
import { ICommunityDetails } from "@/app/models/community/communityModel"
import { Cake, Crown, User, User2, Users2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface PageProps {
  id: number
}

export function CommunityDetails({ id }: PageProps) {
  const [data, setData] = useState<ICommunityDetails>()
  const [loading, setLoading] = useState(true)
  const [topFollowers, setTopFollowers] = useState<ICommunityDetails["seguidores"]>()

  async function fetchPageData() {
    const response = await GetCommunityDetails(id)
    if (response) {
      setData(response)
      const topFollowers = response.seguidores.slice(0, 15)
      setTopFollowers(topFollowers)
      console.log(topFollowers)
    }
  }

  function parseDate(date: Date) {
    const parsedDate = new Date(date)
    return parsedDate.toLocaleDateString("pt-BR")
  }

  useEffect(() => {
    fetchPageData()
    setLoading(false)
  }, [])

  return (
    <div className="flex w-full gap-6 items-start justify-start">
      {data && (
        <div className="flex gap-2 w-full">
          <Card className="w-full max-w-64 h-min">
            <div
              className="w-auto relative aspect-video max-w-80 bg-auto bg-center
                    bg-muted-foreground bg-no-repeat overflow-hidden border-none 
                    bg-clip-content justify-between flex flex-col
                    rounded-t-lg
                    "
              style={{
                backgroundImage: `url(${data.imagemCapa ||
                  "/community-images/community-placeholder.png"
                  })`,
              }}></div>
            <CardHeader className="flex flex-row gap-2 items-center justify-between">
              <div className="flex flex-col">
                <CardTitle>{data.nome}</CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <CardDescription>
                <div className="flex flex-col items-start">
                  <Link href={`alunos/${data.criador.id}`} className="flex items-center gap-1">
                    <Crown className="w-4" /> {data.criador.nome}
                  </Link>

                  <span className="flex items-center gap-5">
                    <span className="flex items-center gap-1
                    ">
                      <Cake className="w-4" /> {parseDate(data.dataCriacao)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users2 className="w-4" /> {data.quantidadeSeguidores}
                    </span>
                  </span>

                  <Separator className="my-2" />


                  <div className="flex flex-col gap-2">
                    {topFollowers?.map((follower) => (
                      <Link href={`alunos/${follower.id}`} key={follower.id} className="flex items-center gap-1">
                        <Image src={follower.img} width={24} height={24} className="rounded-full" alt="" /> {follower.nome}
                      </Link>
                    ))}
                    <Button variant={"secondary"} className="mt-2">
                      <Link href={`comunidades/${id}/seguidores`}>Ver todos</Link>
                    </Button>
                  </div>


                </div>
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="flex flex-row gap-2 items-center justify-between">
              <div className="flex flex-col">
                <CardTitle>Postagens</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <div className="flex flex-col gap-2">
                  {data.posts.map((post) => (
                    <div key={post.id} className="flex flex-col gap-2">
                      <div className="flex flex-row gap-2 items-center justify-between">
                        <Button variant={'link'} className="m-0 p-0">
                          <Link href={`alunos/${post.autor.id}`} className="flex items-center gap-2">
                            <Image src={post.autor.img} width={24} height={24} className="rounded-full" alt="" /> {post.autor.nome}
                          </Link>
                        </Button>
                        <span className="text-muted-foreground">{parseDate(post.dataPostagem)}</span>
                      </div>
                      <p>{post.conteudo}</p>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
