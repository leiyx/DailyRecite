"use client";

import { useState, type FormEvent } from "react";

interface RegisterFormProps {
  onClose: () => void;
  onSuccess: (username: string) => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({
  onClose,
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("请输入用户名和密码");
      return;
    }

    if (password !== confirm) {
      setError("两次输入的密码不一致");
      return;
    }

    if (password.length < 4) {
      setError("密码至少需要 4 个字符");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "注册失败");
        return;
      }
      onSuccess(json.data.username);
    } catch {
      setError("网络错误，请重试");
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full px-4 py-2.5 border-2 border-[#d4e8d4] rounded-xl text-sm bg-white text-[#1a2e1a] placeholder:text-[#b8d8b8] focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200";

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-green-950/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="modal-panel bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-[#d4e8d4]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[#d4e8d4] bg-[#fefcf5]">
          <h2 className="text-lg font-bold text-[#1a2e1a] font-hand">
            创建管理员账户
          </h2>
          <p className="text-xs text-[#6b8f6b] mt-1">
            这是你的个人网站，只需创建一次账户
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 bg-white">
          <div>
            <label className="block text-sm font-medium text-[#2d4a2d] mb-1.5">
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="设置用户名"
              className={inputCls}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2d4a2d] mb-1.5">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 4 个字符"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2d4a2d] mb-1.5">
              确认密码
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="再次输入密码"
              className={inputCls}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-press w-full px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-2xl hover:bg-green-700 shadow-md shadow-green-200/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
          >
            {submitting ? "创建中..." : "创建账户"}
          </button>
        </form>

        <div className="px-6 py-4 border-t border-[#d4e8d4] bg-[#fefcf5] text-center">
          <button
            onClick={onSwitchToLogin}
            className="text-sm text-green-600 hover:text-green-700 cursor-pointer transition-colors"
          >
            已有账户？登录
          </button>
        </div>
      </div>
    </div>
  );
}
