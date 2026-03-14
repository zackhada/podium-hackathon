// Custom PropBot icon — solid house silhouette with arched door cutout.
// Uses `fill="currentColor"` so it adapts to any text-color context.
export function PropBotIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2L21.5 11H19V21H5V11H2.5L12 2Z M10 21V16.5Q10 14 12 14Q14 14 14 16.5V21Z"
      />
    </svg>
  );
}
