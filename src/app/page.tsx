"use client";

import { useState, useEffect, useCallback } from "react";
import type { Post } from "@/lib/types";
import Header from "@/components/header";
import CardGrid from "@/components/card-grid";
import PostDetail from "@/components/post-detail";
import PostForm from "@/components/post-form";

type Modal =
  | { type: "detail"; postId: number }
  | { type: "add" }
  | { type: "edit"; post: Post };

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [modal, setModal] = useState<Modal | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/posts");
      const json = await res.json();
      if (json.success) {
        setPosts(json.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function handleDelete(id: number) {
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setModal(null);
    }
  }

  return (
    <>
      <Header onAdd={() => setModal({ type: "add" })} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="size-6 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
          </div>
        ) : (
          <CardGrid
            posts={posts}
            onCardClick={(post) => setModal({ type: "detail", postId: post.id })}
          />
        )}
      </main>

      {/* Detail modal */}
      {modal?.type === "detail" && (
        <PostDetail
          postId={modal.postId}
          onClose={() => setModal(null)}
          onEdit={(post) => setModal({ type: "edit", post })}
          onDelete={handleDelete}
        />
      )}

      {/* Add modal */}
      {modal?.type === "add" && (
        <PostForm
          onClose={() => setModal(null)}
          onSuccess={() => {
            setModal(null);
            fetchPosts();
          }}
        />
      )}

      {/* Edit modal */}
      {modal?.type === "edit" && (
        <PostForm
          post={modal.post}
          onClose={() => setModal({ type: "detail", postId: modal.post.id })}
          onSuccess={() => {
            setModal(null);
            fetchPosts();
          }}
        />
      )}
    </>
  );
}
