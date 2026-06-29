"use client";

import type { Post } from "@/lib/types";

interface CardProps {
  post: Post;
  onClick: (post: Post) => void;
}

/* 7-color blue card theme palette */
const CARD_THEMES = [
  { bar: "#4A90D9", bg: "#EBF3FC", dot: "#4A90D9", emoji: "📖" },
  { bar: "#5B8DEF", bg: "#EEF3FD", dot: "#5B8DEF", emoji: "📝" },
  { bar: "#6C8EBF", bg: "#F0F4FA", dot: "#6C8EBF", emoji: "✨" },
  { bar: "#3D7AB5", bg: "#EBF2F9", dot: "#3D7AB5", emoji: "🌟" },
  { bar: "#7EB8DA", bg: "#F2F7FB", dot: "#7EB8DA", emoji: "💡" },
  { bar: "#A0C4E8", bg: "#F5F8FC", dot: "#A0C4E8", emoji: "📚" },
  { bar: "#89B4D9", bg: "#F4F7FB", dot: "#89B4D9", emoji: "💭" },
];

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}

/** Deterministic slight tilt per card */
function getRotation(id: number): string {
  const angles = [
    "-0.8deg", "0.5deg", "-0.4deg", "0.8deg", "-1deg",
    "0.3deg", "-0.6deg", "0.9deg", "-0.3deg", "0.5deg",
  ];
  return angles[id % angles.length];
}

export default function Card({ post, onClick }: CardProps) {
  const theme = CARD_THEMES[post.id % CARD_THEMES.length];
  const rotation = getRotation(post.id);

  return (
    <button
      onClick={() => onClick(post)}
      style={{ "--card-rotate": rotation } as React.CSSProperties}
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
        {/* Emoji tag */}
        <span
          className="emoji-tag absolute top-3 right-4"
          title={theme.emoji}
        >
          {theme.emoji}
        </span>

        {/* Date */}
        <span className="font-hand text-sm text-[#8fa1b5] mb-3 block tracking-wide">
          {formatDate(post.date)}
        </span>

        {/* Title */}
        <h3 className="font-display text-base font-bold text-[#1a2332] group-hover:text-[#4A90D9] transition-colors duration-300 line-clamp-2 leading-snug pr-7">
          {post.title || "无标题"}
        </h3>

        {/* Decorative dots */}
        <div className="flex gap-1.5 mt-4">
          <span className="size-1.5 rounded-full opacity-40" style={{ backgroundColor: theme.dot }} />
          <span className="size-1.5 rounded-full opacity-70" style={{ backgroundColor: theme.dot }} />
          <span className="size-1.5 rounded-full" style={{ backgroundColor: theme.dot }} />
        </div>
      </div>
    </button>
  );
}
