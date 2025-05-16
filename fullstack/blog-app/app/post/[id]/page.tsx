"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

// Import Redux hooks and actions
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchPostById } from "@/redux/features/posts/postsSlice"

export default function PostDetail() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const dispatch = useAppDispatch()
  
  // Get post state from Redux
  const { post, loading, error } = useAppSelector((state) => state.posts)

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id))
    }
  }, [dispatch, id])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="overflow-hidden animate-pulse">
          <div className="h-64 bg-muted"></div>
          <CardHeader>
            <div className="h-8 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-2 w-2/3"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4 text-destructive">Error loading post</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => dispatch(fetchPostById(id))}>Try Again</Button>
        <Button variant="outline" className="ml-4" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4">Post not found</h2>
        <Link href="/">
          <Button>Back to Posts</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center gap-1"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <Card className="bg-[#F8F3D9]">
        <div className="relative h-64 w-full">
          <Image
            src={post.imageUrl || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover p-5"
          />
        </div>
        
        <CardHeader>
          <h1 className="text-2xl font-bold text-[#AB886D]">{post.title}</h1>
          <p className="text-sm text-[#AB886D]">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="prose max-w-none">
            {post.content.split('\n').map((paragraph, i) => (
              <p key={i} className="text-[#AB886D]">{paragraph}</p>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Link href={`/edit/${post._id}`}>
            <Button className="flex items-center gap-1 bg-[#EAE4D5] hover:bg-[#c5c1b5] text-[#1f1e1d]">
              <Edit className="h-4 w-4" />
              Edit Post
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}