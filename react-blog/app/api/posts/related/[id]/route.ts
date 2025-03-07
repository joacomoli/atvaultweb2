import { type NextRequest, NextResponse } from "next/server"
import { getRelatedPosts } from "@/lib/services/post-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const relatedPosts = await getRelatedPosts(params.id)
    return NextResponse.json(relatedPosts)
  } catch (error) {
    console.error("Error fetching related posts:", error)
    return NextResponse.json({ error: "Error fetching related posts" }, { status: 500 })
  }
}

