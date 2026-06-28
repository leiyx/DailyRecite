"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/lib/types";

interface PostDetailProps {
  postId: number | null;
  onClose: () => void;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

function WavyHeading({ children }: { children: string }) {
  return (
    <h3 className="relative inline-block font-hand text-base text-green-600 mb-3">
      {children}
      <svg
        className="absolute -bottom-1 left-0 w-full"
        viewBox="0 0 40 3"
        height="3"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,1.5 Q5,0 10,1.5 Q15,3 20,1.5 Q25,0 30,1.5 Q35,3 40,1.5"
          stroke="#16a34a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </h3>
  );
}

export default function PostDetail({
  postId,
  onClose,
  onEdit,
  onDelete,
}: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (postId === null) return;

    let cancelled = false;
    setLoading(true);

    fetch(`/api/posts/${postId}`)
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.success) {
          setPost(json.data);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [postId]);

  if (postId === null) return null;

  function formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split("-");
    return `${y}年${Number(m)}月${Number(d)}日`;
  }

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-green-950/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="modal-panel bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-[#d4e8d4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d4e8d4] bg-[#fefcf5]">
          <div>
            <span className="font-hand text-sm text-green-500">
              {post ? formatDate(post.date) : ""}
            </span>
            <h2 className="text-lg font-bold text-[#1a2e1a] mt-0.5">
              {post?.title || "加载中..."}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6b8f6b] hover:text-green-700 hover:bg-green-50 rounded-xl cursor-pointer transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 bg-white">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="size-6 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
            </div>
          ) : post ? (
            <div className="space-y-6">
              {/* Article */}
              <div>
                <WavyHeading>文章</WavyHeading>
                <div className="text-[#1a2e1a] leading-relaxed whitespace-pre-wrap text-base">
                  {post.article}
                </div>
              </div>

              {/* Notes */}
              {post.notes && (
                <div>
                  <WavyHeading>注释</WavyHeading>
                  <div className="text-[#2d4a2d] leading-relaxed whitespace-pre-wrap text-base bg-green-50/70 rounded-2xl p-4 border border-green-100">
                    {post.notes}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-[#6b8f6b] py-12">未找到文章</p>
          )}
        </div>

        {/* Actions */}
        {post && (
          <div className="flex items-center gap-3 px-6 py-4 border-t border-[#d4e8d4] bg-[#fefcf5]">
            <button
              onClick={() => onEdit(post)}
              className="btn-press inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-green-700 bg-white border-2 border-green-300 rounded-2xl hover:bg-green-50 hover:border-green-400 cursor-pointer transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4"
              >
                <path d="M2.695 14.762l-1.262 3.154a.5.5 0 00.65.651l3.155-1.262a4 4 0 001.343-.885l5.823-5.823a1.5 1.5 0 000-2.122l-1.294-1.294a1.5 1.5 0 00-2.122 0L3.165 12.004a4 4 0 00-.885 1.343l.415-2.585zm0 0" />
              </svg>
              编辑
            </button>
            <button
              onClick={() => {
                if (confirm("确定删除这条记录吗？")) {
                  onDelete(post.id);
                }
              }}
              className="btn-press inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 bg-white border-2 border-red-200 rounded-2xl hover:bg-red-50 hover:border-red-300 cursor-pointer transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                  clipRule="evenodd"
                />
              </svg>
              删除
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
