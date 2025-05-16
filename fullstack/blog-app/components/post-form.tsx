"use client"

import type React from "react"

import { useState } from "react"
import type { Post } from "@/redux/features/posts/postsSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

type PostFormProps = {
  onSubmit: (data: Omit<Post, "_id" | "createdAt">) => void
  isSubmitting: boolean
  initialData?: {
    title: string
    content: string
    imageUrl: string
  }
}

export default function PostForm({ onSubmit, isSubmitting, initialData }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "/placeholder.svg?height=400&width=600")
  const [errors, setErrors] = useState<{ title?: string; content?: string; imageUrl?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: { title?: string; content?: string; imageUrl?: string } = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!content.trim()) {
      newErrors.content = "Content is required"
    }

    if (!imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit form
    onSubmit({
      title,
      content,
      imageUrl,
    })
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#AB886D]">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-[#AB886D]">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                className={`min-h-[200px] ${errors.content ? "border-destructive" : ""}`}
              />
              {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-[#AB886D]">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className={errors.imageUrl ? "border-destructive" : ""}
              />
              {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl}</p>}
              <p className="text-sm text-[#9f8979]">
                Enter a URL for your post image. You can use placeholder images for testing.
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="bg-[#EAE4D5] hover:bg-[#c5c1b5] text-[#1f1e1d]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>Save Post</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
