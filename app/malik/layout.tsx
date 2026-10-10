"use client";
import { useEffect } from "react";

export default function MalikRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.classList.add("malik-mode");
    return () => {
      document.body.classList.remove("malik-mode");
    };
  }, []);

  return <div className="malik-root min-h-screen text-white">{children}</div>;
}
