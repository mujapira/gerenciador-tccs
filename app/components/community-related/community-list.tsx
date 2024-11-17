"use client"

import { useEffect, useState } from "react"

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
import { ICommunity, ICommunityFromBase } from "@/app/models/mongoModels"
import { getAllComunidades } from "@/app/server-actions/mongoActions"

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
  const [pageSubject, setPageSubject] = useState<ICommunityFromBase[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchPageSubject = async () => {
    const currentPage = Number(searchParams.get("page")) || 1;
    const filterCreator = searchParams.get("filterCreator") || "Todos";
    const filterFollowers = searchParams.get("filterFollowers") || "Todos";

    const methodResponse = await getAllComunidades({
      page: currentPage,
      itemsPerPage,
      creatorFilter: filterCreator,
      followersFilter: filterFollowers,
    });

    if (methodResponse) {
      const formattedResponse = methodResponse.data.map((community) => ({
        ...community,
        seguidores: community.seguidores.map((seguidor) => ({
          id: seguidor.id,
          tipo: seguidor.tipo,
          data_seguimento: seguidor.data_seguimento,
        })),
      }));

      setPageSubject(formattedResponse);
      setTotalItems(methodResponse.total);
    }
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("filterCreator");
    params.delete("filterFollowers");
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    fetchPageSubject();
  }, [searchParams]);

  const handleFilterChange = (
    newFilterCreator: string,
    newFilterFollowers: string
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("filterCreator", newFilterCreator);
    params.set("filterFollowers", newFilterFollowers);
    router.push(`?${params.toString()}`);
  };

  const paginate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

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
            value={searchParams.get("filterCreator") || "Todos"}
            onValueChange={(value) =>
              handleFilterChange(value, searchParams.get("filterFollowers") || "Todos")
            }
          >
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
            value={searchParams.get("filterFollowers") || "Todos"}
            onValueChange={(value) =>
              handleFilterChange(searchParams.get("filterCreator") || "Todos", value)
            }
          >
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
          {pageSubject.map((subject) => (
            <CommunityCard key={subject.id} data={subject} />
          ))}
        </div>

        <Pagination className="w-full items-center justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const currentPage = Number(searchParams.get("page")) || 1;
                  if (currentPage > 1) paginate(currentPage - 1);
                }}
              />
            </PaginationItem>
            {Array.from(
              { length: Math.ceil(totalItems / itemsPerPage) },
              (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={Number(searchParams.get("page")) === index + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      paginate(index + 1);
                    }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const currentPage = Number(searchParams.get("page")) || 1;
                  const totalPages = Math.ceil(totalItems / itemsPerPage);
                  if (currentPage < totalPages) paginate(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
