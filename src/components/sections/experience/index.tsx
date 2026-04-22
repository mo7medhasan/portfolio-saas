
// src/components/sections/experience/index.tsx
import type { ExperienceContent } from "@/types/sections";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { ExperienceCards }   from "./ExperienceCards";
import { ExperienceCompact } from "./ExperienceCompact";

interface Props { content: ExperienceContent; variant: string; }
export function ExperienceSection({ content, variant }: Props) {
  switch (variant) {
    case "cards":   return <ExperienceCards   content={content} />;
    case "compact": return <ExperienceCompact content={content} />;
    default:        return <ExperienceTimeline content={content} />;
  }
}