// src/components/sections/about/AboutSplitPhoto.tsx
import type { AboutContent } from "@/types/sections";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function AboutSplitPhoto({ content: c }: { content: AboutContent }) {
  const skills = c.skills || [];

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "var(--color-background, #fff)" }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Photo Column */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[400px] aspect-[4/5] group">
              {/* Decorative backgrounds */}
              <div 
                className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border-2 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"
                style={{ borderColor: "color-mix(in srgb, var(--color-primary, #6C63FF) 30%, transparent)" }}
              />
              <div 
                className="absolute inset-0 -translate-x-4 -translate-y-4 rounded-3xl opacity-20 transition-transform duration-500 group-hover:-translate-x-6 group-hover:-translate-y-6"
                style={{ background: "var(--color-primary, #6C63FF)" }}
              />
              
              {/* Image Container */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gray-100" style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}>
                {c.photoUrl ? (
                  <Image
                    src={c.photoUrl}
                    alt={c.heading || "About"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-3xl">
                    <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">أضف صورتك</span>
                  </div>
                )}
              </div>

              {/* Floating Badge */}
              <div 
                className="absolute -bottom-6 -right-6 lg:-right-12 z-20 px-6 py-5 rounded-2xl shadow-xl backdrop-blur-md"
                style={{
                  background: "color-mix(in srgb, var(--color-surface, #fff) 90%, transparent)",
                  border: "1px solid var(--color-border, #eee)"
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white"
                    style={{ background: "var(--color-primary, #6C63FF)" }}
                  >
                    {c.yearsExp || "5"}+
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--color-heading, #111)" }}>سنوات خبرة</div>
                    <div className="text-xs" style={{ color: "var(--color-text-secondary, #666)" }}>في المجال</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3">
                <span className="w-8 h-[2px]" style={{ background: "var(--color-primary, #6C63FF)" }} />
                <span 
                  className="text-sm font-bold tracking-widest uppercase"
                  style={{ color: "var(--color-primary, #6C63FF)" }}
                >
                  {c.subheading || "عني"}
                </span>
              </div>
              <h2 
                className="text-[clamp(2rem,3.5vw,3rem)] leading-tight tracking-tight"
                style={{
                  fontFamily: "var(--font-heading, sans-serif)",
                  fontWeight: "var(--font-weight-heading, 700)",
                  color: "var(--color-heading, #111)",
                }}
              >
                {c.heading || "من أنا وما الذي أقدمه؟"}
              </h2>
            </div>

            <p 
              className="text-lg leading-relaxed max-w-xl"
              style={{ color: "var(--color-text-secondary, #555)" }}
            >
              {c.bio || "اكتب هنا نبذة عنك، خلفيتك، شغفك، وإيه اللي بيميزك."}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-8 border-y" style={{ borderColor: "var(--color-border, #e2e2e2)" }}>
              <div>
                <div className="text-3xl font-bold mb-1" style={{ color: "var(--color-heading, #111)" }}>{c.projectsCount || "50+"}</div>
                <div className="text-sm font-medium" style={{ color: "var(--color-text-secondary, #666)" }}>مشروع منجز</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1" style={{ color: "var(--color-heading, #111)" }}>{c.clientsCount || "30+"}</div>
                <div className="text-sm font-medium" style={{ color: "var(--color-text-secondary, #666)" }}>عميل سعيد</div>
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--color-heading, #111)" }}>المهارات الأساسية</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:-translate-y-1"
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

            {/* Actions */}
            {c.cvUrl && (
              <div className="pt-4">
                <a 
                  href={c.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                  style={{
                    background: "var(--color-primary, #6C63FF)",
                    color: "#fff"
                  }}
                >
                  تحميل السيرة الذاتية
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
