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
import { Cake, Crown, User, User2, Users2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ICommunity, IStudent, ITeacher } from "@/app/models/mongoModels"
import { getCommunity } from "@/app/server-actions/mongoActions"

interface PageProps {
  id: string
}

export function CommunityDetails({ id }: PageProps) {
  const [data, setData] = useState<ICommunity>()
  const [loading, setLoading] = useState(true)
  const [topFollowers, setTopFollowers] = useState<ICommunity["seguidores"]>()
  const [creator, setCreator] = useState<IStudent | ITeacher>()

  async function fetchPageData() {
    const response = await getCommunity(id)
    console.log(response)
    if (response) {
      setData(response)
      const topFollowers = response.seguidores.slice(0, 15)
      setTopFollowers(topFollowers)
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
                backgroundImage: `url(${data.imagem_capa ||
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
                  {data.criador.tipo === "aluno" ? (
                    <Link href={`/alunos/${data.criador.info.id}`} className="flex items-center gap-1">
                      <Crown className="w-4" /> {data.criador.info.nome}
                    </Link>
                  ) : (
                    <Link href={`/orientador/${data.criador.info.id}`} className="flex items-center gap-1">
                      <Crown className="w-4" /> {data.criador.info.nome}
                    </Link>
                  )}

                  <span className="flex items-center gap-5">
                    <span className="flex items-center gap-1
                    ">
                      <Cake className="w-4" /> {parseDate(data.data_criacao)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users2 className="w-4" /> {data.seguidores.length}
                    </span>
                  </span>

                  <Separator className="my-2" />

                  <div className="flex flex-col gap-3">
                    {topFollowers?.map((follower) => (
                      <>
                        {follower.tipo === "aluno" ? (
                          <Link href={`/alunos/${follower.info.id}`} key={follower.info.id} className="flex items-center gap-2">
                            <Image src={follower.info.caminho_foto} width={24} height={24} className="rounded-full" alt="" /> {follower.info.nome}
                          </Link>
                        ) : (
                          <Link href={`/orientador/${follower.info.id}`} key={follower.info.id} className="flex items-center gap-2">
                            <Image src={follower.info.caminho_foto} width={24} height={24} className="rounded-full" alt="" /> {follower.info.nome}
                          </Link>
                        )}
                      </>
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
                    <div key={post.data_postagem.toLocaleTimeString()} className="flex flex-col gap-2">
                      <div className="flex flex-row gap-2 items-center justify-between">
                        <Button variant={'link'} className="m-0 p-0">
                          {post.autor.tipo === "aluno" ? (
                            <Link href={`/alunos/${post.autor.info.id}`} className="flex items-center gap-2">
                              <Image src={post.autor.info.caminho_foto} width={24} height={24} className="rounded-full object-cover max-w-6 max-h-6" alt="" /> {post.autor.info.nome}
                            </Link>
                          ) : (
                            <Link href={`/orientadores/${post.autor.info.id}`} className="flex items-center gap-2">
                              <Image src={post.autor.info.caminho_foto} width={24} height={24} className="rounded-full" alt="" /> {post.autor.info.nome}
                            </Link>
                          )}
                        </Button>
                        <span className="text-muted-foreground">{parseDate(post.data_postagem)}</span>
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
