"use client";

import { useState, useRef } from "react";
import { Sparkles, ArrowRight, Mail } from "lucide-react";

export default function ComingSoon() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-15 to 15 degrees based on mouse position relative to center)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Reset position when mouse leaves
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#030303] overflow-hidden text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Dynamic Background Elements */}
      <div 
        className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" 
        style={{ animationDuration: '8s' }} 
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse pointer-events-none" 
        style={{ animationDuration: '10s' }} 
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-indigo-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" 
      />
      
      {/* Noise overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
      />

      {/* 3D Container Area */}
      <div 
        ref={containerRef}
        className="relative z-10 w-full max-w-4xl px-6 py-12"
        style={{ perspective: "1200px" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* The Tilting Card */}
        <div 
          className="relative transition-transform ease-out duration-200"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: "preserve-3d",
            transition: isHovering ? "transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
          }}
        >
          {/* Main Content Box */}
          <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-10 md:p-20 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center overflow-visible">
            
            {/* Shimmer inner effect */}
            <div className="absolute inset-0 bg-linear-to-tr from-white/5 via-transparent to-white/5 opacity-50 rounded-[2.5rem] pointer-events-none" />
            
            {/* 3D Floating Elements attached to the card */}
            <div 
              className="absolute -top-12 -right-12 w-40 h-40 bg-linear-to-br from-blue-500 to-purple-600 rounded-full opacity-50 blur-2xl pointer-events-none transition-transform duration-300"
              style={{ transform: "translateZ(80px)" }}
            />
            <div 
              className="absolute -bottom-12 -left-12 w-40 h-40 bg-linear-to-tr from-indigo-500 to-pink-600 rounded-full opacity-40 blur-2xl pointer-events-none transition-transform duration-300"
              style={{ transform: "translateZ(40px)" }}
            />

            {/* Geometric floating shapes */}
            <div 
              className="hidden md:block absolute top-20 right-10 w-16 h-16 border border-white/20 rounded-xl rotate-12 backdrop-blur-sm pointer-events-none"
              style={{ transform: "translateZ(100px)" }}
            />
            <div 
              className="hidden md:block absolute bottom-20 left-10 w-20 h-20 border border-white/10 rounded-full -rotate-12 backdrop-blur-sm pointer-events-none"
              style={{ transform: "translateZ(120px)" }}
            />

            {/* Content Layer with Z-translation for 3D depth */}
            <div 
              className="relative z-10 flex flex-col items-center w-full transition-transform duration-300" 
              style={{ transform: "translateZ(60px)" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-sm font-semibold text-blue-200 tracking-widest uppercase">Coming Soon</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-b from-white via-white/90 to-white/40 mb-6 tracking-tight leading-tight">
                Redefining the <br className="hidden md:block" /> Digital Canvas
              </h1>

              <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-xl leading-relaxed">
                We&apos;re meticulously crafting a next-generation SaaS platform that will elevate your portfolio to new heights. Join the waitlist for exclusive early access.
              </p>
{/* 
              <form 
                className="flex flex-col sm:flex-row w-full max-w-md gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-md"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="group relative flex items-center justify-center px-8 py-4 bg-white text-black font-semibold rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-white via-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative flex items-center gap-2">
                    Notify Me
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </form> */}
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
}
