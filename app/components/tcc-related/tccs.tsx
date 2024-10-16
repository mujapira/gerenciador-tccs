import prisma from "../../lib/prisma"

export async function Tccs() {
  const tccs = await prisma.vw_tcc_detalhado.findMany()

  return (
    <main className="flex  w-full h-full justify-center flex-col gap-8 items-center min-h-[calc(100vh-68px)]">
      <h1>Tccs</h1>
      <ul>
        {tccs.map((tccs) => (
          <li key={tccs.tcc_id}>{tccs.titulo_tcc}</li>
        ))}
      </ul>
    </main>
  )
}
