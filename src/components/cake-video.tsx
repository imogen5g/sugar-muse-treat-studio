import { useEffect, useRef } from "react";

export function CakeVideo({ src, name, poster }: { src: string; name: string; poster?: string | undefined }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (video.preload === "none") {
            video.preload = "metadata";
            video.load();
          }
          if (!reducedMotion.matches) void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={`${name} cake video`}
      muted
      loop
      playsInline
      controls
      preload="none"
      className="h-full w-full object-cover"
    />
  );
}