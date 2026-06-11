export default function HatIcon({ color = "currentColor", size = 220 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <ellipse cx="110" cy="172" rx="92" ry="14" fill={color} opacity="0.18" />
      <ellipse cx="110" cy="158" rx="88" ry="14" fill={color} />
      <path d="M 52 158 Q 52 56 110 48 Q 168 56 168 158 Z" fill={color} />
      <rect x="52" y="140" width="116" height="14" fill="#000" opacity="0.32" />
    </svg>
  );
}
