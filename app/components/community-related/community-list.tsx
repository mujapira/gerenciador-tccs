"use client"

import { useEffect, useState } from "react"

import { CommunityOverview } from "@/app/models/community/communityModel"
import { GetCommunityOverview } from "@/app/server-actions/community/getCommunityOverview"
import { CommunityCard } from "./community-card"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export enum FilterCreator {
  Aluno = "Aluno",
  Orientador = "Orientador",
  Todos = "Todos",
}

export enum FilterFollowers {
  "0-50" = "0-50",
  "50-100" = "50-100",
  "100+" = "100+",
  Todos = "Todos",
}

export function Communities() {
  const [pageSubject, setPageSubject] = useState<CommunityOverview[]>([])
  const [filteredCommunities, setFilteredCommunities] = useState<
    CommunityOverview[]
  >([])
  const [totalItems, setTotalItems] = useState(0)

  const itemsPerPage = 12
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPage = Number(searchParams.get("page") || 1)
  const filterCreator =
    (searchParams.get("filterCreator") as FilterCreator) || "Todos"
  const filterFollowers =
    (searchParams.get("filterFollowers") as FilterFollowers) || "Todos"
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const fetchPageSubject = async (
    page: number,
    creatorFilter: FilterCreator,
    followersFilter: FilterFollowers
  ) => {
    const methodResponse = await GetCommunityOverview({
      page,
      itemsPerPage,
      creatorFilter,
      followersFilter,
    })
    if (methodResponse?.data) {
      setPageSubject(methodResponse.data)
      setTotalItems(methodResponse.total)
      setFilteredCommunities(methodResponse.data)
    }
  }

  const applyFilters = () => {
    let filtered = [...pageSubject]
    if (filterCreator !== "Todos") {
      filtered = filtered.filter((community) =>
        filterCreator === "Aluno"
          ? community.criador.tipo === "Aluno"
          : community.criador.tipo === "Orientador"
      )
    }
    if (filterFollowers !== "Todos") {
      filtered = filtered.filter((community) => {
        switch (filterFollowers) {
          case "0-50":
            return community.quantidadeSeguidores <= 50
          case "50-100":
            return (
              community.quantidadeSeguidores > 50 &&
              community.quantidadeSeguidores <= 100
            )
          case "100+":
            return community.quantidadeSeguidores > 100
          default:
            return true
        }
      })
    }
    setFilteredCommunities(filtered)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("filterCreator")
    params.delete("filterFollowers")
    router.push(`?${params.toString()}`)
  }

  useEffect(() => {
    fetchPageSubject(currentPage, filterCreator, filterFollowers)
  }, [currentPage, filterCreator, filterFollowers])

  useEffect(() => {
    applyFilters()
  }, [pageSubject])

  const handleFilterChange = (
    newFilterCreator: string,
    newFilterFollowers: string
  ) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", "1")
    params.set("filterCreator", newFilterCreator)
    params.set("filterFollowers", newFilterFollowers)
    router.push(`?${params.toString()}`)
  }

  const paginate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex w-full gap-6 items-start justify-start">
      <Card className="w-1/4 p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <Button className="p-0" variant={"link"} onClick={clearFilters}>
            Limpar Filtros
          </Button>
        </div>

        <div className="flex flex-col gap-2 items-start justify-center">
          <span className="text-sm font-semibold">Criador</span>
          <Select
            value={filterCreator}
            onValueChange={(value) =>
              handleFilterChange(value, filterFollowers)
            }>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Criador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Aluno">Aluno</SelectItem>
              <SelectItem value="Orientador">Orientador</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 items-start justify-center">
          <span className="text-sm font-semibold">Quantidade</span>
          <Select
            value={filterFollowers}
            onValueChange={(value) => handleFilterChange(filterCreator, value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Seguidores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="0-50">0 - 50</SelectItem>
              <SelectItem value="50-100">50 - 100</SelectItem>
              <SelectItem value="100+">100+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="w-full flex flex-col gap-12 max-w-screen-xl">
        <div className="grid grid-cols-3 justify-between gap-6">
          {filteredCommunities.map((subject) => (
            <CommunityCard key={subject.id} data={subject} />
          ))}
        </div>

        <Pagination className="w-full items-center justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) paginate(currentPage - 1)
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={(e) => {
                    e.preventDefault()
                    paginate(index + 1)
                  }}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) paginate(currentPage + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
