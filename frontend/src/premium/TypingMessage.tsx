'use client';

import { useEffect, useState } from 'react';

interface TypingMessageProps {
  text: string;
  speed?: number;
  className?: string;
}

/**
 * Exibe mensagem com efeito de digitação e fadeInSmooth.
 */
export function TypingMessage({
  text,
  speed = 40,
  className = '',
}: TypingMessageProps) {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setIsComplete(false);
    let i = 0;
    const t = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(t);
      }
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);

  return (
    <p
      className={`${className}`}
      style={{
        animation: 'fadeInSmooth 300ms ease forwards',
      }}
    >
      {displayed}
      {!isComplete && (
        <span
          className="inline-block w-0.5 h-4 bg-[#B3124F] ml-0.5 animate-pulse"
          style={{ verticalAlign: 'text-bottom' }}
        />
      )}
    </p>
  );
}
