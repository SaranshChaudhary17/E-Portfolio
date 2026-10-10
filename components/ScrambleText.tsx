"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

const DIGITS = "0123456789";

export function useScramble(text: string, speed = 32) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const textRef = useRef(text);
  textRef.current = text;

  // Keep display synchronized when text updates (e.g. clock time)
  useEffect(() => {
    if (!intervalRef.current) {
      setDisplay(text);
    }
  }, [text]);

  const trigger = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const currentText = textRef.current;
    const totalChars = currentText.length;
    let step = 0;
    const maxSteps = Math.max(14, totalChars * 2 + 4);

    intervalRef.current = setInterval(() => {
      step++;
      const resolvedCount = Math.floor((step / maxSteps) * totalChars);

      const next = currentText
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (char === "|" || char === "@" || char === ":") return char;
          if (i < resolvedCount) return char;
          return DIGITS[Math.floor(Math.random() * DIGITS.length)];
        })
        .join("");

      setDisplay(next);

      if (step >= maxSteps) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDisplay(currentText);
      }
    }, speed);
  }, [speed]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { display, trigger };
}

interface ScrambleTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
  triggerOnHover?: boolean;
}

export default function ScrambleText({
  text,
  className = "",
  as: Component = "span",
  triggerOnHover = true,
}: ScrambleTextProps) {
  const { display, trigger } = useScramble(text);

  return (
    <Component
      onMouseEnter={triggerOnHover ? trigger : undefined}
      className={`inline-block select-none ${className}`}
    >
      {display}
    </Component>
  );
}
