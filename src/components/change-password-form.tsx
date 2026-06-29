"use client";

import { useState, type FormEvent } from "react";

interface ChangePasswordFormProps {
  onClose: () => void;
  onDone: () => void;
}

export default function ChangePasswordForm({
  onClose,
  onDone,
}: ChangePasswordFormProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!oldPassword || !newPassword) {
      setError("请填写所有字段");
      return;
    }

    if (newPassword.length < 4) {
      setError("新密码至少需要 4 个字符");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "修改失败");
        return;
      }
      onDone();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full px-4 py-2.5 border border-[#d0dae6] rounded-xl text-sm bg-white text-[#1a2332] placeholder:text-[#8fa1b5] focus:outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#EBF3FC] transition-all duration-200";

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-overlay)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="modal-panel bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8ecf2]">
          <h2 className="font-display text-lg font-black text-[#1a2332]">
            🔒 修改密码
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

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#4a5b6e] mb-1.5">
              当前密码
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="输入当前密码"
              className={inputCls}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4a5b6e] mb-1.5">
              新密码
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="至少 4 个字符"
              className={inputCls}
            />
          </div>

          {error && (
            <p className="text-sm text-[#e0556a] bg-[#fef2f4] border border-[#f0c0c6] rounded-xl px-4 py-2.5 flex items-center gap-2">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? "⏳ 保存中..." : "💾 保存新密码"}
          </button>
        </form>
      </div>
    </div>
  );
}
