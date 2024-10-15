import { Alunos } from "@/app/components/alunos"

export default function AlunosPage() {
  return (
    <main className="flex w-full h-full justify-center flex-col gap-8 items-center min-h-[calc(100vh-68px)]">
      <h1>Esta é a página dos alunos</h1>
      <Alunos />
    </main>
  )
}
