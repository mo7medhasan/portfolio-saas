// src/components/sections/about/AboutCard.tsx
import type { AboutContent } from "@/types/sections";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function AboutCard({ content: c }: { content: AboutContent }) {
  const skills = c.skills || [];

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 px-4 sm:px-6"
      style={{ background: "var(--color-surface, #f8f8f8)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div 
          className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden backdrop-blur-xl"
          style={{ 
            background: "var(--color-background, #fff)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.08)",
            border: "1px solid var(--color-border, #eee)"
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Image Section */}
            <div className="lg:col-span-5 relative h-[60vh] lg:h-auto min-h-[400px]">
              {c.photoUrl ? (
                <Image
                  src={c.photoUrl}
                  alt={c.heading || "About"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-gray-400 flex flex-col items-center">
                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>أضف صورتك</span>
                  </div>
                </div>
              )}
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/40 lg:to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="text-4xl font-black mb-1">{c.yearsExp || "5"}+</div>
                <div className="text-white/80 font-medium">سنوات من الخبرة العملية</div>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <span 
                className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 self-start"
                style={{ 
                  background: "color-mix(in srgb, var(--color-primary, #6C63FF) 10%, transparent)",
                  color: "var(--color-primary, #6C63FF)"
                }}
              >
                {c.subheading || "عني"}
              </span>

              <h2 
                className="text-[clamp(1.8rem,3vw,2.5rem)] leading-tight mb-6"
                style={{
                  fontFamily: "var(--font-heading, sans-serif)",
                  fontWeight: "var(--font-weight-heading, 700)",
                  color: "var(--color-heading, #111)",
                }}
              >
                {c.heading || "من أنا وما الذي أقدمه؟"}
              </h2>

              <p 
                className="text-lg leading-relaxed mb-10"
                style={{ color: "var(--color-text-secondary, #555)" }}
              >
                {c.bio || "اكتب هنا نبذة عنك، خلفيتك، شغفك، وإيه اللي بيميزك."}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="p-6 rounded-2xl" style={{ background: "var(--color-surface, #f8f8f8)" }}>
                  <div className="text-3xl font-black mb-2" style={{ color: "var(--color-heading, #111)" }}>{c.projectsCount || "50+"}</div>
                  <div className="text-sm font-semibold" style={{ color: "var(--color-text-secondary, #666)" }}>مشروع منجز</div>
                </div>
                <div className="p-6 rounded-2xl" style={{ background: "var(--color-surface, #f8f8f8)" }}>
                  <div className="text-3xl font-black mb-2" style={{ color: "var(--color-heading, #111)" }}>{c.clientsCount || "30+"}</div>
                  <div className="text-sm font-semibold" style={{ color: "var(--color-text-secondary, #666)" }}>عميل سعيد</div>
                </div>
              </div>

              {skills.length > 0 && (
                <div className="mb-10">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium"
                        style={{ 
                          background: "var(--color-surface, #f8f8f8)",
                          color: "var(--color-text-primary, #333)",
                          border: "1px solid var(--color-border, #eee)"
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {c.cvUrl && (
                <div>
                  <a 
                    href={c.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider group"
                    style={{ color: "var(--color-primary, #6C63FF)" }}
                  >
                    استعراض السيرة الذاتية
                    <span className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110" style={{ background: "color-mix(in srgb, var(--color-primary, #6C63FF) 10%, transparent)" }}>
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </a>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
