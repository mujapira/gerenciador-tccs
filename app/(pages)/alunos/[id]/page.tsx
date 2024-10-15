import { AlunoDetalhado } from "@/app/components/aluno-detalhado"

export default async function AlunoPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <main className="flex  w-full h-full justify-center flex-col gap-8 items-center min-h-[calc(100vh-68px)]">
      <h1>esta é a página detalhada do aluno</h1>
      <AlunoDetalhado id={parseInt(params.id)} />
    </main>
  )
}
