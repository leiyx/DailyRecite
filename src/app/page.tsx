"use client";

import { useState, useEffect, useCallback } from "react";
import type { Post } from "@/lib/types";
import Header from "@/components/header";
import CardGrid from "@/components/card-grid";
import PostDetail from "@/components/post-detail";
import PostForm from "@/components/post-form";
import LoginForm from "@/components/login-form";
import RegisterForm from "@/components/register-form";
import ChangePasswordForm from "@/components/change-password-form";

type Modal =
  | { type: "detail"; postId: number }
  | { type: "add" }
  | { type: "edit"; post: Post }
  | { type: "login" }
  | { type: "register" }
  | { type: "changePassword" };

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [modal, setModal] = useState<Modal | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth state
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Check auth status on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.loggedIn) {
          setLoggedIn(true);
          setUsername(json.data.user?.username || "");
        }
      })
      .catch(() => {});
  }, []);

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
    } else if (res.status === 401) {
      handleAuthExpired();
    }
  }

  function handleLoginSuccess(user: string) {
    setLoggedIn(true);
    setUsername(user);
    setModal(null);
  }

  function handleRegisterSuccess(user: string) {
    setLoggedIn(true);
    setUsername(user);
    setModal(null);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setLoggedIn(false);
    setUsername("");
    setModal(null);
  }

  function handleAuthExpired() {
    setLoggedIn(false);
    setUsername("");
    setModal({ type: "login" });
  }

  return (
    <>
      <Header
        loggedIn={loggedIn}
        username={username}
        onAdd={() => setModal({ type: "add" })}
        onLogin={() => setModal({ type: "login" })}
        onChangePassword={() => setModal({ type: "changePassword" })}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="size-8 border-2 border-[#d0dae6] border-t-[#4A90D9] rounded-full animate-spin" />
          </div>
        ) : (
          <CardGrid
            posts={posts}
            onCardClick={(post) => setModal({ type: "detail", postId: post.id })}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center pb-8 text-sm text-[#8fa1b5]">
        <span className="inline-flex items-center gap-1">
          Made with
          <span className="inline-block animate-sparkle">💖</span>
          — 每日背诵
        </span>
      </footer>

      {/* Detail modal */}
      {modal?.type === "detail" && (
        <PostDetail
          postId={modal.postId}
          loggedIn={loggedIn}
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

      {/* Login modal */}
      {modal?.type === "login" && (
        <LoginForm
          onClose={() => setModal(null)}
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setModal({ type: "register" })}
        />
      )}

      {/* Register modal */}
      {modal?.type === "register" && (
        <RegisterForm
          onClose={() => setModal(null)}
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setModal({ type: "login" })}
        />
      )}

      {/* Change password modal */}
      {modal?.type === "changePassword" && (
        <ChangePasswordForm
          onClose={() => setModal(null)}
          onDone={handleLogout}
        />
      )}
    </>
  );
}
