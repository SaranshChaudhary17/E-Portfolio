"use client";

export default function EcgLine() {
  return (
    <div
      className="hidden sm:flex items-center px-1.5 py-1 select-none"
      title="SYSTEM_PULSE // NORMAL"
    >
      <svg
        className="w-11 h-4 overflow-visible"
        viewBox="0 0 52 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dim base ECG baseline track */}
        <path
          d="M 0 8 L 12 8 L 15 5 L 18 8 L 22 8 L 24 1 L 27 15 L 29 8 L 33 8 L 36 6 L 39 8 L 52 8"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/20"
        />
        {/* Animated ECG Heartbeat pulse in theme accent color */}
        <path
          d="M 0 8 L 12 8 L 15 5 L 18 8 L 22 8 L 24 1 L 27 15 L 29 8 L 33 8 L 36 6 L 39 8 L 52 8"
          stroke="var(--accent)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-ecg-heartbeat"
          style={{
            filter: "drop-shadow(0 0 4px var(--accent))",
          }}
        />
      </svg>
    </div>
  );
}
