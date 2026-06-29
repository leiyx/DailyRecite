"use client";

import type { Post } from "@/lib/types";
import Card from "./card";

interface CardGridProps {
  posts: Post[];
  onCardClick: (post: Post) => void;
}

export default function CardGrid({ posts, onCardClick }: CardGridProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#4a5b6e]">
        {/* Cartoon book illustration */}
        <div className="animate-float mb-8">
          <svg
            viewBox="0 0 160 140"
            className="size-40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Book body */}
            <rect x="25" y="15" width="110" height="95" rx="6" fill="white" stroke="#1a2332" strokeWidth="2.5" />
            {/* Book spine */}
            <line x1="25" y1="15" x2="25" y2="110" stroke="#1a2332" strokeWidth="2.5" />
            {/* Colored bookmark */}
            <rect x="22" y="18" width="6" height="28" rx="3" fill="#4A90D9" />
            {/* Page lines */}
            <path d="M40,45 Q65,42 90,45 Q115,48 125,45" stroke="#6C8EBF" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M40,58 Q65,55 90,58 Q115,61 125,58" stroke="#5B8DEF" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M40,71 Q65,68 90,71 Q115,74 125,71" stroke="#7EB8DA" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M40,84 Q65,81 90,84 Q100,86 115,84" stroke="#3D7AB5" strokeWidth="1.5" strokeLinecap="round" />
            {/* Big emoji on the book */}
            <text x="80" y="130" textAnchor="middle" fontSize="28">📚</text>
          </svg>
        </div>

        {/* Sparkle decorations */}
        <div className="flex gap-6 mb-4">
          <span className="animate-sparkle text-lg" style={{ animationDelay: "0s" }}>✨</span>
          <span className="animate-sparkle text-2xl" style={{ animationDelay: "0.6s" }}>⭐</span>
          <span className="animate-sparkle text-lg" style={{ animationDelay: "1.2s" }}>💫</span>
        </div>

        <p className="text-lg font-hand text-[#1a2332] mb-1">还没有文章~</p>
        <p className="text-sm text-[#8fa1b5]">
          快来写第一篇吧！
        </p>
        <p className="text-xs text-[#8fa1b5] mt-1">
          点击右上角「
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EBF3FC] text-[#4A90D9] rounded-full text-xs font-semibold">
            ✏️ 新增
          </span>
          」开始记录
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {posts.map((post, i) => (
        <div
          key={post.id}
          className="card-stagger"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <Card post={post} onClick={onCardClick} />
        </div>
      ))}
    </div>
  );
}
