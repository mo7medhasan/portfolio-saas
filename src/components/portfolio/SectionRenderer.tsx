import type { Section } from "@/db/schema";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { ContactSection } from "./sections/ContactSection";

interface Props {
  section: Section;
}

export function SectionRenderer({ section }: Props) {
  let content: Record<string, unknown> = {};
  try {
    content = JSON.parse(section.content);
  } catch {
    content = {};
  }

  const props = { content, variant: section.variant ?? "default" };

  switch (section.type) {
    case "hero":    return <HeroSection    {...props} />;
    case "about":   return <AboutSection   {...props} />;
    case "contact": return <ContactSection {...props} />;
    case "custom_html":
      return (
        <div dangerouslySetInnerHTML={{ __html: (content.html as string) ?? "" }} />
      );
    default:
      return null;
  }
}