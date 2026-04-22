// src/components/sections/skills/index.tsx
import type { SkillsContent } from "@/types/sections";
import { SkillsTags }    from "./SkillsTags";
import { SkillsBars }    from "./SkillsBars";
import { SkillsGrouped } from "./SkillsGrouped";

interface Props { content: SkillsContent; variant: string; }
export function SkillsSection({ content, variant }: Props) {
  switch (variant) {
    case "bars":    return <SkillsBars    content={content} />;
    case "grouped": return <SkillsGrouped content={content} />;
    default:        return <SkillsTags    content={content} />;
  }
}