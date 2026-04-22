// src/components/dashboard/sections/SectionContentEditor.tsx
// Step 3 — edit the content for whatever section type was picked.
// Each section type gets a bespoke mini-form that matches its content shape.
"use client";
import type { SectionType } from "@/types/sections";

interface Props {
  sectionType: SectionType;
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}

// ── Shared field primitives ──────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wide"
        style={{ color:"var(--color-text-secondary,#555)" }}>{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 text-sm rounded-[var(--radius-md,8px)] border border-[var(--color-border,#e5e5e5)] outline-none transition-colors focus:border-[var(--color-primary,#6C63FF)]";
const inputStyle = { background:"var(--color-surface,#f8f8f8)", color:"var(--color-text-primary,#111)" };

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange:(v:string)=>void; placeholder?:string; type?:string }) {
  return <input type={type} className={inputCls} style={inputStyle} value={value ?? ""} placeholder={placeholder} onChange={e=>onChange(e.target.value)} />;
}

function Textarea({ value, onChange, placeholder, rows = 3 }: { value:string; onChange:(v:string)=>void; placeholder?:string; rows?:number }) {
  return <textarea rows={rows} className={`${inputCls} resize-none`} style={inputStyle} value={value ?? ""} placeholder={placeholder} onChange={e=>onChange(e.target.value)} />;
}

function set(content: Record<string,unknown>, key: string, value: unknown) {
  return { ...content, [key]: value };
}

function AddBtn({ onClick, label = "إضافة" }: { onClick:()=>void; label?:string }) {
  return (
    <button type="button" onClick={onClick}
      className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-dashed border-[var(--color-primary,#6C63FF)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary,#6C63FF)_6%,transparent)]"
      style={{ color:"var(--color-primary,#6C63FF)" }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      {label}
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick:()=>void }) {
  return (
    <button type="button" onClick={onClick}
      className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center transition-colors hover:bg-red-50 hover:text-red-500"
      style={{ color:"var(--color-text-secondary,#555)" }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
    </button>
  );
}

function ItemCard({ children, onRemove }: { children: React.ReactNode; onRemove:()=>void }) {
  return (
    <div className="p-4 rounded-xl border border-[var(--color-border,#e5e5e5)] space-y-3 relative"
      style={{ background:"var(--color-background,#fff)" }}>
      <div className="absolute top-3 right-3"><RemoveBtn onClick={onRemove} /></div>
      {children}
    </div>
  );
}

// ── Section editors ──────────────────────────────────────────────────────────

function HeroEditor({ c, set: s }: { c: Record<string,unknown>; set:(k:string,v:unknown)=>void }) {
  return (
    <>
      <Field label="Badge Text"><Input value={c.badgeText as string} onChange={v=>s("badgeText",v)} placeholder="متاح للعمل ✓" /></Field>
      <Field label="العنوان الرئيسي"><Input value={c.headline as string} onChange={v=>s("headline",v)} placeholder="أنا هنا — Frontend Engineer" /></Field>
      <Field label="العنوان الفرعي"><Textarea value={c.subheadline as string} onChange={v=>s("subheadline",v)} placeholder="بأبني تجارب ويب احترافية..." /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="نص الزر الأول"><Input value={c.ctaText as string} onChange={v=>s("ctaText",v)} placeholder="شوف أعمالي" /></Field>
        <Field label="رابط الزر الأول"><Input value={c.ctaUrl as string} onChange={v=>s("ctaUrl",v)} placeholder="#portfolio" /></Field>
        <Field label="نص الزر الثاني"><Input value={c.secondaryCtaText as string} onChange={v=>s("secondaryCtaText",v)} placeholder="تواصل معي" /></Field>
        <Field label="رابط الزر الثاني"><Input value={c.secondaryCtaUrl as string} onChange={v=>s("secondaryCtaUrl",v)} placeholder="#contact" /></Field>
      </div>
      <Field label="رابط الصورة"><Input value={c.imageUrl as string} onChange={v=>s("imageUrl",v)} placeholder="https://..." /></Field>
    </>
  );
}

function AboutEditor({ c, set: s }: { c: Record<string,unknown>; set:(k:string,v:unknown)=>void }) {
  const skills = (c.skills as string[]) ?? [];
  return (
    <>
      <Field label="العنوان"><Input value={c.heading as string} onChange={v=>s("heading",v)} placeholder="عني" /></Field>
      <Field label="العنوان الفرعي"><Input value={c.subheading as string} onChange={v=>s("subheading",v)} placeholder="من أنا وما الذي أقدمه" /></Field>
      <Field label="السيرة الذاتية"><Textarea rows={4} value={c.bio as string} onChange={v=>s("bio",v)} placeholder="اكتب نبذة عنك..." /></Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="سنوات الخبرة"><Input value={c.yearsExp as string} onChange={v=>s("yearsExp",v)} placeholder="5+" /></Field>
        <Field label="عدد المشاريع"><Input value={c.projectsCount as string} onChange={v=>s("projectsCount",v)} placeholder="50+" /></Field>
        <Field label="عدد العملاء"><Input value={c.clientsCount as string} onChange={v=>s("clientsCount",v)} placeholder="30+" /></Field>
      </div>
      <Field label="المهارات (مفصولة بفاصلة)">
        <Input value={skills.join(", ")} onChange={v=>s("skills", v.split(",").map(x=>x.trim()).filter(Boolean))} placeholder="React, TypeScript, Node.js" />
      </Field>
      <Field label="رابط الصورة"><Input value={c.photoUrl as string} onChange={v=>s("photoUrl",v)} placeholder="https://..." /></Field>
      <Field label="رابط السيرة الذاتية"><Input value={c.cvUrl as string} onChange={v=>s("cvUrl",v)} placeholder="https://..." /></Field>
    </>
  );
}

function ServicesEditor({ c, set: s }: { c: Record<string,unknown>; set:(k:string,v:unknown)=>void }) {
  type Item = { id:string; title:string; description:string; icon:string; price:string };
  const items = (c.items as Item[]) ?? [];
  const update = (i:number, k:string, v:string) => {
    const next = items.map((it,idx)=>idx===i?{...it,[k]:v}:it);
    s("items", next);
  };
  const add = () => s("items",[...items,{id:Date.now().toString(),title:"",description:"",icon:"◈",price:""}]);
  const remove = (i:number) => s("items",items.filter((_,idx)=>idx!==i));
  return (
    <>
      <Field label="العنوان"><Input value={c.heading as string} onChange={v=>s("heading",v)} placeholder="خدماتي" /></Field>
      <Field label="العنوان الفرعي"><Input value={c.subheading as string} onChange={v=>s("subheading",v)} placeholder="إيه اللي أقدر أساعدك بيه" /></Field>
      <div className="space-y-3 mt-2">
        {items.map((item,i)=>(
          <ItemCard key={item.id} onRemove={()=>remove(i)}>
            <div className="grid grid-cols-4 gap-2">
              <Field label="أيقونة"><Input value={item.icon} onChange={v=>update(i,"icon",v)} placeholder="🎨" /></Field>
              <div className="col-span-3"><Field label="العنوان"><Input value={item.title} onChange={v=>update(i,"title",v)} placeholder="تصميم UI/UX" /></Field></div>
            </div>
            <Field label="الوصف"><Textarea value={item.description} onChange={v=>update(i,"description",v)} placeholder="وصف الخدمة..." /></Field>
            <Field label="السعر (اختياري)"><Input value={item.price} onChange={v=>update(i,"price",v)} placeholder="يبدأ من $500" /></Field>
          </ItemCard>
        ))}
      </div>
      <AddBtn onClick={add} label="إضافة خدمة" />
    </>
  );
}

function PortfolioEditor({ c, set: s }: { c: Record<string,unknown>; set:(k:string,v:unknown)=>void }) {
  type Item = { id:string; title:string; description:string; imageUrl:string; url:string; repoUrl:string; tags:string[]; featured:boolean };
  const items = (c.items as Item[]) ?? [];
  const update = (i:number, k:string, v:unknown) => {
    s("items", items.map((it,idx)=>idx===i?{...it,[k]:v}:it));
  };
  const add = () => s("items",[...items,{id:Date.now().toString(),title:"",description:"",imageUrl:"",url:"",repoUrl:"",tags:[],featured:false}]);
  const remove = (i:number) => s("items",items.filter((_,idx)=>idx!==i));
  return (
    <>
      <Field label="العنوان"><Input value={c.heading as string} onChange={v=>s("heading",v)} placeholder="أعمالي" /></Field>
      <div className="space-y-3 mt-2">
        {items.map((item,i)=>(
          <ItemCard key={item.id} onRemove={()=>remove(i)}>
            <Field label="اسم المشروع"><Input value={item.title} onChange={v=>update(i,"title",v)} /></Field>
            <Field label="الوصف"><Textarea value={item.description} onChange={v=>update(i,"description",v)} /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="رابط المشروع"><Input value={item.url} onChange={v=>update(i,"url",v)} placeholder="https://..." /></Field>
              <Field label="رابط GitHub"><Input value={item.repoUrl} onChange={v=>update(i,"repoUrl",v)} placeholder="https://github.com/..." /></Field>
            </div>
            <Field label="رابط الصورة"><Input value={item.imageUrl} onChange={v=>update(i,"imageUrl",v)} placeholder="https://..." /></Field>
            <Field label="Tags (مفصولة بفاصلة)">
              <Input value={item.tags.join(", ")} onChange={v=>update(i,"tags",v.split(",").map(x=>x.trim()).filter(Boolean))} placeholder="React, TypeScript" />
            </Field>
            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color:"var(--color-text-primary,#111)" }}>
              <input type="checkbox" checked={item.featured} onChange={e=>update(i,"featured",e.target.checked)} className="w-4 h-4 rounded" />
              مشروع مميز (featured)
            </label>
          </ItemCard>
        ))}
      </div>
      <AddBtn onClick={add} label="إضافة مشروع" />
    </>
  );
}

function SkillsEditor({ c, set: s }: { c: Record<string,unknown>; set:(k:string,v:unknown)=>void }) {
  type Item = { id:string; name:string; level:number; category:string };
  const items = (c.items as Item[]) ?? [];
  const update = (i:number, k:string, v:unknown) => s("items", items.map((it,idx)=>idx===i?{...it,[k]:v}:it));
  const add = () => s("items",[...items,{id:Date.now().toString(),name:"",level:80,category:""}]);
  const remove = (i:number) => s("items",items.filter((_,idx)=>idx!==i));
  return (
    <>
      <Field label="العنوان"><Input value={c.heading as string} onChange={v=>s("heading",v)} placeholder="مهاراتي" /></Field>
      <div className="space-y-3 mt-2">
        {items.map((item,i)=>(
          <ItemCard key={item.id} onRemove={()=>remove(i)}>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2"><Field label="المهارة"><Input value={item.name} onChange={v=>update(i,"name",v)} placeholder="React" /></Field></div>
              <Field label="النسبة (%)"><Input type="number" value={String(item.level)} onChange={v=>update(i,"level",Number(v))} /></Field>
            </div>
            <Field label="الفئة"><Input value={item.category} onChange={v=>update(i,"category",v)} placeholder="Frontend" /></Field>
          </ItemCard>
        ))}
      </div>
      <AddBtn onClick={add} label="إضافة مهارة" />
    </>
  );
}

function ExperienceEditor({ c, set: s }: { c: Record<string,unknown>; set:(k:string,v:unknown)=>void }) {
  type Item = { id:string; role:string; company:string; period:string; description:string; logoUrl:string; current:boolean };
  const items = (c.items as Item[]) ?? [];
  const update = (i:number, k:string, v:unknown) => s("items", items.map((it,idx)=>idx===i?{...it,[k]:v}:it));
  const add = () => s("items",[...items,{id:Date.now().toString(),role:"",company:"",period:"",description:"",logoUrl:"",current:false}]);
  const remove = (i:number) => s("items",items.filter((_,idx)=>idx!==i));
  return (
    <>
      <Field label="العنوان"><Input value={c.heading as string} onChange={v=>s("heading",v)} placeholder="خبراتي" /></Field>
      <div className="space-y-3 mt-2">
        {items.map((item,i)=>(
          <ItemCard key={item.id} onRemove={()=>remove(i)}>
            <div className="grid grid-cols-2 gap-2">
              <Field label="المسمى الوظيفي"><Input value={item.role} onChange={v=>update(i,"role",v)} placeholder="Frontend Developer" /></Field>
              <Field label="الشركة"><Input value={item.company} onChange={v=>update(i,"company",v)} placeholder="اسم الشركة" /></Field>
            </div>
            <Field label="الفترة الزمنية"><Input value={item.period} onChange={v=>update(i,"period",v)} placeholder="2022 - الآن" /></Field>
            <Field label="الوصف"><Textarea value={item.description} onChange={v=>update(i,"description",v)} placeholder="وصف المهام..." /></Field>
            <Field label="رابط لوجو الشركة"><Input value={item.logoUrl} onChange={v=>update(i,"logoUrl",v)} placeholder="https://..." /></Field>
            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color:"var(--color-text-primary,#111)" }}>
              <input type="checkbox" checked={item.current} onChange={e=>update(i,"current",e.target.checked)} className="w-4 h-4 rounded" />
              وظيفة حالية
            </label>
          </ItemCard>
        ))}
      </div>
      <AddBtn onClick={add} label="إضافة وظيفة" />
    </>
  );
}

function TestimonialsEditor({ c, set: s }: { c: Record<string,unknown>; set:(k:string,v:unknown)=>void }) {
  type Item = { id:string; name:string; role:string; company:string; avatarUrl:string; quote:string; rating:number };
  const items = (c.items as Item[]) ?? [];
  const update = (i:number, k:string, v:unknown) => s("items", items.map((it,idx)=>idx===i?{...it,[k]:v}:it));
  const add = () => s("items",[...items,{id:Date.now().toString(),name:"",role:"",company:"",avatarUrl:"",quote:"",rating:5}]);
  const remove = (i:number) => s("items",items.filter((_,idx)=>idx!==i));
  return (
    <>
      <Field label="العنوان"><Input value={c.heading as string} onChange={v=>s("heading",v)} placeholder="ماذا يقولون عني" /></Field>
      <div className="space-y-3 mt-2">
        {items.map((item,i)=>(
          <ItemCard key={item.id} onRemove={()=>remove(i)}>
            <div className="grid grid-cols-2 gap-2">
              <Field label="الاسم"><Input value={item.name} onChange={v=>update(i,"name",v)} /></Field>
              <Field label="التقييم (1-5)"><Input type="number" value={String(item.rating)} onChange={v=>update(i,"rating",Math.min(5,Math.max(1,Number(v))))} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="المنصب"><Input value={item.role} onChange={v=>update(i,"role",v)} placeholder="CTO" /></Field>
              <Field label="الشركة"><Input value={item.company} onChange={v=>update(i,"company",v)} /></Field>
            </div>
            <Field label="الاقتباس"><Textarea value={item.quote} onChange={v=>update(i,"quote",v)} placeholder="رأيه في عملك..." /></Field>
            <Field label="رابط الصورة الشخصية"><Input value={item.avatarUrl} onChange={v=>update(i,"avatarUrl",v)} placeholder="https://..." /></Field>
          </ItemCard>
        ))}
      </div>
      <AddBtn onClick={add} label="إضافة شهادة" />
    </>
  );
}

function FaqEditor({ c, set: s }: { c: Record<string,unknown>; set:(k:string,v:unknown)=>void }) {
  type Item = { id:string; question:string; answer:string };
  const items = (c.items as Item[]) ?? [];
  const update = (i:number, k:string, v:string) => s("items", items.map((it,idx)=>idx===i?{...it,[k]:v}:it));
  const add = () => s("items",[...items,{id:Date.now().toString(),question:"",answer:""}]);
  const remove = (i:number) => s("items",items.filter((_,idx)=>idx!==i));
  return (
    <>
      <Field label="العنوان"><Input value={c.heading as string} onChange={v=>s("heading",v)} placeholder="أسئلة شائعة" /></Field>
      <Field label="العنوان الفرعي"><Input value={c.subheading as string} onChange={v=>s("subheading",v)} /></Field>
      <div className="space-y-3 mt-2">
        {items.map((item,i)=>(
          <ItemCard key={item.id} onRemove={()=>remove(i)}>
            <Field label="السؤال"><Input value={item.question} onChange={v=>update(i,"question",v)} /></Field>
            <Field label="الإجابة"><Textarea value={item.answer} onChange={v=>update(i,"answer",v)} /></Field>
          </ItemCard>
        ))}
      </div>
      <AddBtn onClick={add} label="إضافة سؤال" />
    </>
  );
}

function StatsEditor({ c, set: s }: { c: Record<string,unknown>; set:(k:string,v:unknown)=>void }) {
  type Item = { id:string; value:string; label:string; prefix:string; suffix:string };
  const items = (c.items as Item[]) ?? [];
  const update = (i:number, k:string, v:string) => s("items", items.map((it,idx)=>idx===i?{...it,[k]:v}:it));
  const add = () => s("items",[...items,{id:Date.now().toString(),value:"",label:"",prefix:"",suffix:""}]);
  const remove = (i:number) => s("items",items.filter((_,idx)=>idx!==i));
  return (
    <>
      <Field label="العنوان (اختياري)"><Input value={c.heading as string} onChange={v=>s("heading",v)} /></Field>
      <div className="space-y-3 mt-2">
        {items.map((item,i)=>(
          <ItemCard key={item.id} onRemove={()=>remove(i)}>
            <div className="grid grid-cols-4 gap-2">
              <Field label="قبل"><Input value={item.prefix} onChange={v=>update(i,"prefix",v)} placeholder="" /></Field>
              <Field label="القيمة"><Input value={item.value} onChange={v=>update(i,"value",v)} placeholder="50" /></Field>
              <Field label="بعد"><Input value={item.suffix} onChange={v=>update(i,"suffix",v)} placeholder="+" /></Field>
              <Field label="التسمية"><Input value={item.label} onChange={v=>update(i,"label",v)} placeholder="مشروع" /></Field>
            </div>
          </ItemCard>
        ))}
      </div>
      <AddBtn onClick={add} label="إضافة رقم" />
    </>
  );
}

function CtaEditor({ c, set: s }: { c: Record<string,unknown>; set:(k:string,v:unknown)=>void }) {
  return (
    <>
      <Field label="العنوان"><Input value={c.heading as string} onChange={v=>s("heading",v)} placeholder="مستعد للتعاون؟" /></Field>
      <Field label="العنوان الفرعي"><Input value={c.subheading as string} onChange={v=>s("subheading",v)} placeholder="تواصل معي وابدأ مشروعك اليوم" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="نص الزر"><Input value={c.ctaText as string} onChange={v=>s("ctaText",v)} placeholder="ابدأ الآن" /></Field>
        <Field label="رابط الزر"><Input value={c.ctaUrl as string} onChange={v=>s("ctaUrl",v)} placeholder="#contact" /></Field>
      </div>
    </>
  );
}

function ContactEditor({ c, set: s }: { c: Record<string,unknown>; set:(k:string,v:unknown)=>void }) {
  type Socials = Record<string,string>;
  const socials = (c.socialLinks as Socials) ?? {};
  const updateSocial = (k:string, v:string) => s("socialLinks",{...socials,[k]:v});
  return (
    <>
      <Field label="العنوان"><Input value={c.heading as string} onChange={v=>s("heading",v)} placeholder="تواصل معي" /></Field>
      <Field label="العنوان الفرعي"><Input value={c.subheading as string} onChange={v=>s("subheading",v)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="الإيميل"><Input type="email" value={c.email as string} onChange={v=>s("email",v)} placeholder="hello@example.com" /></Field>
        <Field label="الهاتف"><Input value={c.phone as string} onChange={v=>s("phone",v)} placeholder="+20..." /></Field>
      </div>
      <Field label="الموقع"><Input value={c.location as string} onChange={v=>s("location",v)} placeholder="القاهرة، مصر" /></Field>
      <p className="text-xs font-semibold uppercase tracking-wide pt-2" style={{ color:"var(--color-text-secondary,#555)" }}>روابط السوشيال</p>
      <div className="grid grid-cols-2 gap-3">
        {["github","linkedin","twitter","instagram","behance","dribbble"].map(k=>(
          <Field key={k} label={k}><Input value={socials[k] ?? ""} onChange={v=>updateSocial(k,v)} placeholder={`https://${k}.com/...`} /></Field>
        ))}
      </div>
    </>
  );
}

function CustomHtmlEditor({ c, set: s }: { c: Record<string,unknown>; set:(k:string,v:unknown)=>void }) {
  return (
    <>
      <Field label="HTML"><Textarea rows={6} value={c.html as string} onChange={v=>s("html",v)} placeholder="<div>...</div>" /></Field>
      <Field label="CSS"><Textarea rows={4} value={c.css as string} onChange={v=>s("css",v)} placeholder=".my-class { ... }" /></Field>
      <Field label="JavaScript"><Textarea rows={4} value={c.js as string} onChange={v=>s("js",v)} placeholder="console.log('hello')" /></Field>
    </>
  );
}

// ── Main dispatcher ──────────────────────────────────────────────────────────

export function SectionContentEditor({ sectionType, content, onChange }: Props) {
  const s = (k: string, v: unknown) => onChange(set(content, k, v));
  const editorProps = { c: content, set: s };

  return (
    <div className="space-y-4">
      {sectionType === "hero"         && <HeroEditor         {...editorProps} />}
      {sectionType === "about"        && <AboutEditor        {...editorProps} />}
      {sectionType === "services"     && <ServicesEditor     {...editorProps} />}
      {sectionType === "portfolio"    && <PortfolioEditor    {...editorProps} />}
      {sectionType === "skills"       && <SkillsEditor       {...editorProps} />}
      {sectionType === "experience"   && <ExperienceEditor   {...editorProps} />}
      {sectionType === "testimonials" && <TestimonialsEditor {...editorProps} />}
      {sectionType === "faq"          && <FaqEditor          {...editorProps} />}
      {sectionType === "stats"        && <StatsEditor        {...editorProps} />}
      {sectionType === "cta"          && <CtaEditor          {...editorProps} />}
      {sectionType === "contact"      && <ContactEditor      {...editorProps} />}
      {sectionType === "custom_html"  && <CustomHtmlEditor   {...editorProps} />}
    </div>
  );
}
