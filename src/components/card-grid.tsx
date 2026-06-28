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
      <div className="flex flex-col items-center justify-center py-24 text-[#6b8f6b]">
        {/* Hand-drawn notebook illustration */}
        <div className="animate-float">
          <svg
            viewBox="0 0 120 120"
            className="size-32 mb-6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Notebook body */}
            <rect
              x="30" y="20" width="60" height="75" rx="4"
              fill="white" stroke="#16a34a" strokeWidth="2"
            />
            {/* Binding rings */}
            <circle cx="45" cy="22" r="4" fill="white" stroke="#16a34a" strokeWidth="1.5" />
            <circle cx="60" cy="22" r="4" fill="white" stroke="#16a34a" strokeWidth="1.5" />
            <circle cx="75" cy="22" r="4" fill="white" stroke="#16a34a" strokeWidth="1.5" />
            {/* Lines on paper (hand-drawn wavy) */}
            <path d="M38,40 Q50,38 60,40 Q70,42 82,40" stroke="#b8d8b8" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M38,50 Q50,48 60,50 Q70,52 82,50" stroke="#b8d8b8" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M38,60 Q50,58 60,60 Q70,62 82,60" stroke="#b8d8b8" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M38,70 Q55,68 65,70 Q75,72 82,70" stroke="#b8d8b8" strokeWidth="1.5" strokeLinecap="round" />
            {/* Pencil */}
            <g transform="translate(75, 65) rotate(45)">
              <rect x="0" y="-3" width="28" height="6" rx="3" fill="#fbbf24" />
              <polygon points="28,-3 28,3 34,0" fill="#fcd34d" />
              <rect x="34" y="-1.5" width="4" height="3" fill="#333" />
            </g>
            {/* Doodle star */}
            <path
              d="M95,30 L97,26 L101,26 L98,23 L99,19 L95,21 L91,19 L92,23 L89,26 L93,26 Z"
              fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5"
            />
          </svg>
        </div>
        <p className="text-lg font-hand text-green-700 mb-1">暂无记录</p>
        <p className="text-sm">点击右上角「新增」开始记录背诵成果</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {posts.map((post) => (
        <Card key={post.id} post={post} onClick={onCardClick} />
      ))}
    </div>
  );
}
