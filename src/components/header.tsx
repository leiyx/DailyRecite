"use client";

import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  loggedIn: boolean;
  username: string;
  onAdd: () => void;
  onLogin: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

export default function Header({
  loggedIn,
  username,
  onAdd,
  onLogin,
  onChangePassword,
  onLogout,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Title */}
        <h1 className="relative font-display text-xl font-black text-[#1a2332] tracking-wide flex items-center gap-2">
          每日背诵
          <span className="animate-spin-slow text-lg inline-block">⭐</span>
          {/* Wavy underline */}
          <svg
            className="absolute -bottom-1 left-0 w-full"
            viewBox="0 0 100 4"
            height="4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,2 Q12,0 25,2 Q38,4 50,2 Q62,0 75,2 Q88,4 100,2"
              stroke="#4A90D9"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </h1>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {loggedIn ? (
            <>
              {/* Add button */}
              <button onClick={onAdd} className="btn-primary btn-press">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                新增
              </button>

              {/* User menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#4a5b6e] hover:bg-[#f0f4f8] rounded-full cursor-pointer transition-colors"
                >
                  <span className="size-7 rounded-full bg-gradient-to-br from-[#4A90D9] to-[#5B8DEF] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {username.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline text-[#1a2332]">{username}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`size-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-lg border border-[#d0dae6] overflow-hidden z-50 py-1">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onChangePassword();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#1a2332] hover:bg-[#EBF3FC] hover:text-[#4A90D9] cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="size-4 text-[#8fa1b5]"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15.5 1.5a2.25 2.25 0 00-3.182 0l-1.318 1.318a.75.75 0 001.06 1.06L13.38 2.56a.75.75 0 011.06 1.06l-1.318 1.318a.75.75 0 101.06 1.06l1.318-1.318a2.25 2.25 0 000-3.182zM12.94 5.06l-8.5 8.5a3.5 3.5 0 00-.99 1.692l-.94 3.127a.75.75 0 00.933.933l3.127-.94a3.5 3.5 0 001.692-.99l8.5-8.5a.75.75 0 00-1.06-1.06l-8.5 8.5a2 2 0 01-.967.566l-2.115.635.635-2.115a2 2 0 01.566-.967l8.5-8.5a.75.75 0 10-1.06-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                      修改密码
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#4A90D9] hover:bg-[#EBF3FC] cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button onClick={onLogin} className="btn-outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
                  clipRule="evenodd"
                />
              </svg>
              登录
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
