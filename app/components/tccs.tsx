import prisma from "../lib/prisma"

export async function Tccs() {
  const tccs = await prisma.vw_tcc_detalhado.findMany()

  return (
    <div>
      <h1>Tccs</h1>
      <ul>
        {tccs.map((tccs) => (
          <li key={tccs.tcc_id}>{tccs.titulo_tcc}</li>
        ))}
      </ul>
    </div>
  )
}
