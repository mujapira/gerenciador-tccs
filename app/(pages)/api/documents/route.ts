import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "public", "documents")

const createUploadDir = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const fileName = decodeURIComponent(searchParams.get("fileName") || "")

  if (!fileName) {
    return NextResponse.json(
      { error: "Nome do arquivo é obrigatório" },
      { status: 400 }
    )
  }

  const filePath = path.join(UPLOAD_DIR, fileName)

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "Arquivo não encontrado" },
      { status: 404 }
    )
  }

  const file = fs.readFileSync(filePath)
  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename=${fileName}`,
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    createUploadDir()

    const contentType = req.headers.get("content-type") || ""
    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { error: "Tipo de conteúdo inválido" },
        { status: 400 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${Date.now()}_${file.name}`
    const filePath = path.join(UPLOAD_DIR, fileName)

    fs.writeFileSync(filePath, buffer)

    return NextResponse.json({
      message: "Arquivo enviado com sucesso",
      path: `/documents/${fileName}`,
    })
  } catch (error) {
    console.error("Erro ao fazer upload:", error)
    return NextResponse.json(
      { error: "Erro ao fazer upload do arquivo" },
      { status: 500 }
    )
  }
}
