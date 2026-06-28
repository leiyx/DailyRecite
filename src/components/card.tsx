"use client";

import type { Post } from "@/lib/types";

interface CardProps {
  post: Post;
  onClick: (post: Post) => void;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}

/** Deterministic rotation based on post ID: gives each card a slight tilt */
function getRotation(id: number): string {
  const angles = [
    "-1.2deg", "0.8deg", "-0.6deg", "1.1deg", "-1.5deg",
    "0.5deg", "-0.9deg", "1.3deg", "-0.4deg", "0.7deg",
  ];
  return angles[id % angles.length];
}

export default function Card({ post, onClick }: CardProps) {
  const rotation = getRotation(post.id);

  return (
    <button
      onClick={() => onClick(post)}
      style={{ transform: `rotate(${rotation})` }}
      className="group block w-full text-left bg-white border-2 border-[#d4e8d4] rounded-3xl p-5
                 hover:border-green-400 hover:shadow-xl hover:-translate-y-1 hover:rotate-0
                 transition-all duration-200 cursor-pointer"
    >
      {/* Paper clip decoration */}
      <svg
        className="absolute -top-2.5 right-4 size-6 text-green-500/70 group-hover:text-green-500 transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 2v16a4 4 0 008 0V6a2 2 0 00-4 0v10" />
      </svg>

      {/* Date */}
      <span className="font-hand text-sm text-green-600 mb-2 block">
        {formatDate(post.date)}
      </span>

      {/* Title */}
      <h3 className="text-base font-bold text-[#1a2e1a] group-hover:text-green-700 transition-colors line-clamp-2">
        {post.title || "无标题"}
      </h3>

      {/* Article preview */}
      {post.article && (
        <p className="mt-2 text-sm text-[#6b8f6b] line-clamp-2 leading-relaxed">
          {post.article}
        </p>
      )}

      {/* Doodle dot decoration */}
      <div className="flex gap-1 mt-3">
        <span className="size-1.5 rounded-full bg-green-300" />
        <span className="size-1.5 rounded-full bg-green-400" />
        <span className="size-1.5 rounded-full bg-green-500" />
      </div>
    </button>
  );
}
