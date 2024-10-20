import { Button } from "@/components/ui/button"
import Link from "next/link"

export function NewClass() {
  return (
    <div>
      <Link href="/turmas/nova">
        <Button>Adicionar nova turma</Button>
      </Link>
    </div>
  )
}
