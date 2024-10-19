import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const POST = async (req: NextRequest) => {
  try {
    const uploadDir = path.join(process.cwd(), "public/user-images")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const contentType = req.headers.get("content-type") || ""
    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      )
    }

    const data = await req.formData()
    const file = data.get("file")

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileExtension = path.extname(file.name) || ".jpg"
    const timestamp = Date.now()
    const fileName = `${timestamp}${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    fs.writeFileSync(filePath, buffer)

    return NextResponse.json({
      message: "File uploaded successfully",
      path: `/user-images/${fileName}`,
    })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: "File upload error" }, { status: 500 })
  }
}

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url)
    const encodedFileName = url.searchParams.get("fileName")
    if (!encodedFileName) {
      return NextResponse.json(
        { error: "File name is required" },
        { status: 400 }
      )
    }

    const fileName = decodeURIComponent(encodedFileName)
    const filePath = path.join(process.cwd(), "public", fileName)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileBuffer = fs.readFileSync(filePath)
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
      },
    })
  } catch (error) {
    console.error("Error retrieving file:", error)
    return NextResponse.json(
      { error: "Error retrieving file" },
      { status: 500 }
    )
  }
}
