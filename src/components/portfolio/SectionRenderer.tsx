// src/components/portfolio/SectionRenderer.tsx
// Parses section DB row → dispatches to correct component.
// Server component — no "use client" needed.
import type { SectionRow, SectionType } from "@/types/sections";
import { HeroSection }         from "@/components/sections/hero";
import { AboutSection }        from "@/components/sections/about";
import { ServicesSection }     from "@/components/sections/services";
import { PortfolioSection }    from "@/components/sections/portfolio";
import { SkillsSection }       from "@/components/sections/skills";
import { ExperienceSection }   from "@/components/sections/experience";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { ContactSection }      from "@/components/sections/contact";
import { FaqSection }          from "@/components/sections/faq";
import { StatsSection }        from "@/components/sections/stats";
import { CtaSection }          from "@/components/sections/cta";

interface Props { section: SectionRow; }

export function SectionRenderer({ section }: Props) {
  if (!section.isVisible) return null;

  let content: Record<string, unknown> = {};
  try { content = JSON.parse(section.content); } catch { content = {}; }

  const props = { content: content as never, variant: section.variant ?? "default" };

  switch (section.type as SectionType) {
    case "hero":         return <HeroSection         {...props} />;
    case "about":        return <AboutSection        {...props} />;
    case "services":     return <ServicesSection     {...props} />;
    case "portfolio":    return <PortfolioSection    {...props} />;
    case "skills":       return <SkillsSection       {...props} />;
    case "experience":   return <ExperienceSection   {...props} />;
    case "testimonials": return <TestimonialsSection {...props} />;
    case "contact":      return <ContactSection      {...props} />;
    case "faq":          return <FaqSection          {...props} />;
    case "stats":        return <StatsSection        {...props} />;
    case "cta":          return <CtaSection          {...props} />;
    case "custom_html":
      return (
        <div>
          {!!content.css && <style dangerouslySetInnerHTML={{ __html: content.css as string }} />}
          <div dangerouslySetInnerHTML={{ __html: (content.html as string) ?? "" }} />
          {!!content.js && <script dangerouslySetInnerHTML={{ __html: content.js as string }} />}
        </div>
      );
    default: return null;
  }
}