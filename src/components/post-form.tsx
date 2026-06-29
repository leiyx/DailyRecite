"use client";

import { useState, type FormEvent } from "react";
import type { Post } from "@/lib/types";

interface PostFormProps {
  post?: Post | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PostForm({ post, onClose, onSuccess }: PostFormProps) {
  const isEdit = !!post;
  const [date, setDate] = useState(post?.date || "");
  const [title, setTitle] = useState(post?.title || "");
  const [article, setArticle] = useState(post?.article || "");
  const [notes, setNotes] = useState(post?.notes || "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!date || !article.trim()) {
      setError("日期和文章内容为必填项");
      return;
    }

    setSubmitting(true);

    const url = isEdit ? `/api/posts/${post.id}` : "/api/posts";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, title: title.trim(), article: article.trim(), notes: notes.trim() }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.error || "提交失败");
        return;
      }

      onSuccess();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full px-4 py-2.5 border border-[#d0dae6] rounded-xl text-sm bg-white text-[#1a2332] placeholder:text-[#8fa1b5] focus:outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#EBF3FC] transition-all duration-200";
  const labelCls = "block text-sm font-medium text-[#4a5b6e] mb-1.5";

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-overlay)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="modal-panel bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8ecf2]">
          <h2 className="font-display text-lg font-black text-[#1a2332]">
            {isEdit ? "✏️ 编辑记录" : "✨ 新增记录"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[#8fa1b5] hover:text-[#1a2332] hover:bg-[#f0f4f8] rounded-full cursor-pointer transition-colors"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Date */}
          <div>
            <label className={labelCls}>
              日期 <span className="text-[#4A90D9]">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Title */}
          <div>
            <label className={labelCls}>标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="如：《岳阳楼记》"
              className={inputCls}
            />
          </div>

          {/* Article */}
          <div>
            <label className={labelCls}>
              文章内容 <span className="text-[#4A90D9]">*</span>
            </label>
            <textarea
              value={article}
              onChange={(e) => setArticle(e.target.value)}
              rows={8}
              placeholder="在此输入背诵的原文..."
              className={inputCls + " resize-y"}
            />
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>注释</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="如：生词注解、段落理解、个人感悟..."
              className={inputCls + " resize-y"}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-[#e0556a] bg-[#fef2f4] border border-[#f0c0c6] rounded-xl px-4 py-2.5 flex items-center gap-2">
              ⚠️ {error}
            </p>
          )}
        </form>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e8ecf2] bg-[#f0f4f8]">
          <button onClick={onClose} className="btn-outline">
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? "⏳ 提交中..." : isEdit ? "💾 保存" : "✨ 创建"}
          </button>
        </div>
      </div>
    </div>
  );
}
