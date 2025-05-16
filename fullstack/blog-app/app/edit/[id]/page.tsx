"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchPostById, updatePost } from "@/redux/features/posts/postsSlice"
import PostForm from "@/components/post-form"
import React from "react"

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { post, loading, error } = useAppSelector((state) => state.posts)

  // Unwrap params using React.use()
  const { id } = React.use(params)

  useEffect(() => {
    dispatch(fetchPostById(id))
  }, [dispatch, id])

  const handleSubmit = async (formData: { title: string; content: string; imageUrl: string }) => {
    try {
      await dispatch(updatePost({ id, postData: formData })).unwrap()
      router.push("/")
    } catch (err) {
      // To handle error
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
          <div className="h-12 bg-muted rounded mb-4"></div>
          <div className="h-32 bg-muted rounded mb-4"></div>
          <div className="h-12 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Post not found</h1>
        <p className="mb-4">The post you are looking for does not exist.</p>
        <button onClick={() => router.push("/")} className="text-primary hover:underline">
          Return to home
        </button>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-8 text-[#DEAA79]">Edit Post</h1>
      <PostForm
        onSubmit={handleSubmit}
        isSubmitting={loading}
        initialData={{
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl,
        }}
      />
    </div>
  )
}