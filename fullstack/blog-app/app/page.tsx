import Link from "next/link"
import { PlusCircle } from "lucide-react"
import PostList from "@/components/post-list"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#DEAA79]">Your Posts</h1>
        <Link href="/create">
          <Button className="flex items-center gap-2 bg-[#F8F3D9] hover:bg-[#EAE4D5] text-[#AB886D]">
            <PlusCircle className="h-4 w-4" />
            Create Post
          </Button>
        </Link>
      </div>
      <PostList />
    </div>
  )
}
