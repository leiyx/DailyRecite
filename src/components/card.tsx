"use client";

import type { Post } from "@/lib/types";

interface CardProps {
  post: Post;
  onClick: (post: Post) => void;
}

/* 7-color blue card theme palette */
const CARD_THEMES = [
  { bar: "#4A90D9", dot: "#4A90D9" },
  { bar: "#5B8DEF", dot: "#5B8DEF" },
  { bar: "#6C8EBF", dot: "#6C8EBF" },
  { bar: "#3D7AB5", dot: "#3D7AB5" },
  { bar: "#7EB8DA", dot: "#7EB8DA" },
  { bar: "#A0C4E8", dot: "#A0C4E8" },
  { bar: "#89B4D9", dot: "#89B4D9" },
];

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}

export default function Card({ post, onClick }: CardProps) {
  const theme = CARD_THEMES[post.id % CARD_THEMES.length];

  return (
    <button
      onClick={() => onClick(post)}
      className="group relative block w-full text-left bg-white rounded-3xl
                 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(74,144,217,0.06)]
                 hover:shadow-[0_8px_30px_rgba(74,144,217,0.18)]
                 transition-all duration-300 ease-out cursor-pointer overflow-hidden
                 hover:-translate-y-1.5 hover:scale-[1.03]"
    >
      {/* Colorful top bar — expands on hover */}
      <div
        className="h-1.5 w-full transition-all duration-300 ease-out group-hover:h-2"
        style={{ backgroundColor: theme.bar }}
      />

      <div className="p-5 pt-4 pb-6">
        {/* Date */}
        <span className="font-hand text-sm text-[#8fa1b5] mb-2 block tracking-wide">
          {formatDate(post.date)}
        </span>

        {/* Title */}
        <h3 className="font-display text-base font-bold text-[#1a2332] group-hover:text-[#4A90D9] transition-colors duration-300 line-clamp-1 leading-snug">
          {post.title || "无标题"}
        </h3>

        {/* Article preview */}
        {post.article && (
          <p className="mt-2 text-sm text-[#8fa1b5] line-clamp-2 leading-relaxed">
            {post.article.slice(0, 60)}{post.article.length > 60 ? "…" : ""}
          </p>
        )}

        {/* Decorative dots */}
        <div className="flex gap-1.5 mt-3">
          <span className="size-1.5 rounded-full opacity-40" style={{ backgroundColor: theme.dot }} />
          <span className="size-1.5 rounded-full opacity-70" style={{ backgroundColor: theme.dot }} />
          <span className="size-1.5 rounded-full" style={{ backgroundColor: theme.dot }} />
        </div>
      </div>
    </button>
  );
}
