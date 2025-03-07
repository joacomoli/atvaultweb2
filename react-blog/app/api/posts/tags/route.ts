import { NextResponse } from "next/server"
import { getTags } from "@/lib/services/post-service"

export async function GET() {
  try {
    const tags = await getTags()
    return NextResponse.json(tags)
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json({ error: "Error fetching tags" }, { status: 500 })
  }
}

