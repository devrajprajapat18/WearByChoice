"use client";
import { useState } from "react";

export default function SafeImage({
  src, alt, className,
}: {
  src: string; alt: string; className?: string; seed?: string;
}) {
  const fallback = `/products/black-crew-tee.jpg`;
  const [current, setCurrent] = useState(src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => { if (current !== fallback) setCurrent(fallback); }}
    />
  );
}
