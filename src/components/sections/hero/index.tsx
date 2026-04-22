// src/components/sections/hero/index.tsx
import type { HeroContent } from "@/types/sections";
import { HeroCentered }   from "./HeroCentered";
import { HeroSplit }      from "./HeroSplit";
import { HeroFullscreen } from "./HeroFullscreen";

interface Props { content: HeroContent; variant: string; }

export function HeroSection({ content, variant }: Props) {
  switch (variant) {
    case "split":      return <HeroSplit      content={content} />;
    case "fullscreen": return <HeroFullscreen content={content} />;
    default:           return <HeroCentered   content={content} />;
  }
}