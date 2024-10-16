import { Tccs } from "@/app/components/tcc-related/tccs"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "TCC's",
  description: "Página de TCCs",
}

export default function TccsPage() {
  return (
    <main>
      <Tccs />
    </main>
  )
}
