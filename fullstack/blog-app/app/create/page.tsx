"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { createPost, resetPostState } from "@/redux/features/posts/postsSlice"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function CreatePost() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  // Get post creation state from Redux
  const { loading, error, success } = useAppSelector((state) => state.posts)
  
  // Local form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  })

  // Handle successful post creation
  useEffect(() => {
    if (success) {
      router.push('/') // Redirect to the posts list
      dispatch(resetPostState()) // Reset the post state
    }
  }, [success, router, dispatch])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(createPost(formData))
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-8 text-[#DEAA79]">Create Post</h1>
      <div className="mb-6">
        <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </Link>
      </div>
      <Card className="min-h-[500px] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col gap-15">
          <CardHeader>
            <CardTitle className="text-[#AB886D]">Create New Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#AB886D]">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter post title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-[#AB886D]">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Enter image URL"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content" className="text-[#AB886D]">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your post content here..."
                rows={8}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={loading}
              className="bg-[#ECDCBF] hover:bg-[#EAE4D5] text-[#AB886D]"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#EAE4D5] hover:bg-[#c5c1b5] text-[#1f1e1d]">
              {loading ? "Creating..." : "Create Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}