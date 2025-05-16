"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Import Redux hooks and actions
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchPosts, deletePost } from "@/redux/features/posts/postsSlice"

export default function PostList() {
  const dispatch = useAppDispatch()

  // Get posts state from Redux
  const { posts, loading, error } = useAppSelector((state) => state.posts)

  useEffect(() => {
    // Fetch posts from API using Redux
    dispatch(fetchPosts())
  }, [dispatch])

  const handleDeletePost = (id: string) => {
    dispatch(deletePost(id))
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="h-48 bg-muted"></div>
            <CardContent className="p-4">
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4 text-destructive">Error loading posts</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => dispatch(fetchPosts())}>Try Again</Button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4 text-[#AB886D]">No posts yet</h2>
        <p className=" mb-6 text-[#AB886D]">Create your first post to get started</p>
        <Link href="/create">
          <Button className="bg-[#F8F3D9] hover:bg-[#EAE4D5] text-[#AB886D]">Create Post</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post._id} className="overflow-hidden transition-all hover:shadow-lg min-h-[300px] flex flex-col bg-[#F8F3D9]">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.imageUrl || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover transition-transform hover:scale-105 p-5"
            />
          </div>
          <CardContent className="p-4 flex-grow">
            <Link href={`/post/${post._id}`}>
              <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors text-[#AB886D]">{post.title}</h2>
            </Link>
            <p className="text-gray-500 line-clamp-3 ">{post.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between p-4 pt-0 mt-auto">
            <Link href={`/edit/${post._id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1 bg-[#ECDCBF] hover:bg-[#EAE4D5]">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1 text-red-900 bg-[#ECDCBF] hover:bg-[#EAE4D5]">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-[#AB886D]">Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-[#AB886D]">
                    This action cannot be undone. This will permanently delete your post.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-[#AB886D]">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeletePost(post._id)} className="bg-[#EAE4D5] hover:bg-[#c5c1b5] text-[#1f1e1d]">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}