"use client";

import * as React from "react";

const GLYPHS = "█▓▒░<>/\\{}[]|=+*#$%&@";

interface DecryptedTextProps {
  text: string;
  className?: string;
  /** ms entre frames do scramble */
  speed?: number;
  /** ms antes de iniciar */
  delay?: number;
}

/**
 * Efeito "decrypt": os caracteres embaralham e resolvem da esquerda
 * para a direita. Respeita prefers-reduced-motion.
 */
export function DecryptedText({ text, className, speed = 26, delay = 0 }: DecryptedTextProps) {
  const [output, setOutput] = React.useState(text);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOutput(text);
      return;
    }

    let frame = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        frame += 1;
        const revealed = Math.floor(frame * 1.35);
        if (revealed >= text.length) {
          setOutput(text);
          if (interval) clearInterval(interval);
          return;
        }
        setOutput(
          text
            .split("")
            .map((ch, i) => {
              if (ch === " ") return " ";
              if (i < revealed) return ch;
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join(""),
        );
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, delay]);

  return (
    <span className={className} aria-label={text}>
      {output}
    </span>
  );
}
