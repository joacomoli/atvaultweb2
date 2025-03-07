import { PostEditor } from "@/components/admin/post-editor"
import { AuthCheck } from "@/components/auth/auth-check"
import { redirect } from "next/navigation"

export default function EditPostPage({ params }: { params: { id: string } }) {
  return (
    <AuthCheck fallback={redirect("/login")}>
      <PostEditor postId={params.id} />
    </AuthCheck>
  )
}

