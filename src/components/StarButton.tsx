'use client';

interface StarButtonProps {
  paperId: string;
  isFavorite: boolean;
  onToggle: (id: string) => void;
}

export function StarButton({ paperId, isFavorite, onToggle }: StarButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(paperId);
      }}
      className={`p-1 rounded transition-colors ${
        isFavorite
          ? 'text-yellow-400 hover:text-yellow-300'
          : 'text-neutral-600 hover:text-neutral-400'
      }`}
      title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
    </button>
  );
}
