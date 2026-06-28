"use client";

export default function Header({ onAdd }: { onAdd: () => void }) {
  return (
    <header className="sticky top-0 z-40 bg-[#fefcf5]/85 backdrop-blur border-b border-[#d4e8d4]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Title with hand-drawn underline */}
        <h1 className="relative text-xl font-bold text-[#1a2e1a] font-hand tracking-wide">
          每日背诵
          <svg
            className="absolute -bottom-1 left-0 w-full"
            viewBox="0 0 100 4"
            height="4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,2 Q12,0 25,2 Q38,4 50,2 Q62,0 75,2 Q88,4 100,2"
              stroke="#16a34a"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </h1>

        {/* Add button */}
        <button
          onClick={onAdd}
          className="btn-press inline-flex items-center gap-1.5 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-2xl hover:bg-green-700 shadow-md shadow-green-200/50 hover:shadow-lg hover:shadow-green-200/60 cursor-pointer transition-all duration-200"
        >
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
      </div>
    </header>
  );
}
