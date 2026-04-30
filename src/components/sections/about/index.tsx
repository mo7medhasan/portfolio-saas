// src/components/sections/about/index.tsx
import type { AboutContent } from "@/types/sections";
import { AboutSplitPhoto } from "./AboutSplitPhoto";
import { AboutCentered } from "./AboutCentered";
import { AboutCard } from "./AboutCard";

interface Props {
  content: AboutContent;
  variant: string;
}

export function AboutSection({ content, variant }: Props) {
  switch (variant) {
    case "split-photo":
      return <AboutSplitPhoto content={content} />;
    case "centered":
      return <AboutCentered content={content} />;
    case "card":
      return <AboutCard content={content} />;
    default:
      // Fallback to split-photo
      return <AboutSplitPhoto content={content} />;
  }
}
