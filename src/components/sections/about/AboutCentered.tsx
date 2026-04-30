// src/components/sections/about/AboutCentered.tsx
import type { AboutContent } from "@/types/sections";
import { ArrowUpRight } from "lucide-react";

export function AboutCentered({ content: c }: { content: AboutContent }) {
  const skills = c.skills || [];

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "var(--color-surface, #f8f8f8)" }}
    >
      <div className="mx-auto max-w-4xl px-6 sm:px-10 text-center">
        
        <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full" style={{ background: "var(--color-background, #fff)", border: "1px solid var(--color-border, #eee)" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--color-primary, #6C63FF)" }} />
          <span 
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "var(--color-primary, #6C63FF)" }}
          >
            {c.subheading || "نبذة شخصية"}
          </span>
        </div>

        <h2 
          className="text-[clamp(2.5rem,4vw,4rem)] leading-[1.1] tracking-tight mb-10"
          style={{
            fontFamily: "var(--font-heading, sans-serif)",
            fontWeight: "var(--font-weight-heading, 700)",
            color: "var(--color-heading, #111)",
          }}
        >
          {c.heading || "من أنا؟"}
        </h2>

        <p 
          className="text-[clamp(1.1rem,2vw,1.5rem)] leading-relaxed mx-auto max-w-3xl mb-16"
          style={{ color: "var(--color-text-secondary, #555)" }}
        >
          {c.bio || "اكتب هنا نبذة عنك، خلفيتك، شغفك، وإيه اللي بيميزك. التركيز هنا على النصوص والمحتوى بشكل أساسي."}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          {[
            { label: "سنوات خبرة", value: c.yearsExp || "5+" },
            { label: "مشروع منجز", value: c.projectsCount || "50+" },
            { label: "عميل سعيد", value: c.clientsCount || "30+" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="p-8 rounded-3xl transition-transform duration-300 hover:-translate-y-2"
              style={{ background: "var(--color-background, #fff)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}
            >
              <div className="text-4xl font-black mb-2" style={{ color: "var(--color-primary, #6C63FF)" }}>{stat.value}</div>
              <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--color-heading, #111)" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-16">
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-5 py-2.5 rounded-full text-sm font-medium transition-colors hover:text-white cursor-default group relative overflow-hidden"
                  style={{ 
                    background: "var(--color-background, #fff)",
                    color: "var(--color-text-primary, #333)",
                    border: "1px solid var(--color-border, #eee)"
                  }}
                >
                  <span className="absolute inset-0 w-full h-full -z-10 transition-transform duration-300 translate-y-full group-hover:translate-y-0" style={{ background: "var(--color-primary, #6C63FF)" }} />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CV Download */}
        {c.cvUrl && (
          <a 
            href={c.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            style={{
              background: "var(--color-heading, #111)",
              color: "var(--color-background, #fff)"
            }}
          >
            استعراض السيرة الذاتية
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        )}
      </div>
    </section>
  );
}
