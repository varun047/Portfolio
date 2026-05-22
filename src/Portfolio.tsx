import { useState } from 'react'

// ── Glassmorphism Card ────────────────────────────────────────────────────────
interface GlassProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  tint?: 'default' | 'purple' | 'dark'
}

export function Glass({ children, className = '', hover = false, tint = 'default' }: GlassProps) {
  const overlay = {
    default: 'rgba(255,255,255,0.05)',
    purple:  'rgba(98,65,190,0.14)',
    dark:    'rgba(6,2,18,0.55)',
  }[tint]

  return (
    <div
      className={`relative rounded-3xl overflow-hidden transition-all duration-500 ${hover ? 'hover:scale-[1.018] cursor-pointer' : ''} ${className}`}
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07)' }}
    >
      {/* Backdrop blur — blurs the fixed starfield canvas behind */}
      <div
        className="absolute inset-0 z-0"
        style={{ backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)' }}
      />
      
      {/* Tinted overlay */}
      <div className="absolute inset-0 z-10" style={{ background: overlay }} />

      {/* SVG Liquid glass distortion filter overlay */}
      <div
        className="absolute inset-0 z-15 pointer-events-none"
        style={{
          filter: 'url(#lg-dist)',
          mixBlendMode: 'overlay',
          opacity: 0.16,
          background: overlay,
        }}
      />

      {/* Specular glossy highlight reflections */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          boxShadow: 'inset 0 20px 20px -10px rgba(255, 255, 255, 0.35), inset 0 -20px 20px -20px rgba(255, 255, 255, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.12)',
        }}
      />

      {/* Content */}
      <div className="relative z-30 h-full">{children}</div>
    </div>
  )
}

// ── Tag pill ──────────────────────────────────────────────────────────────────
function Tag({ label }: { label: string }) {
  return (
    <span
      className="px-3 py-[5px] text-[10px] font-mono tracking-wider rounded-full"
      style={{
        background: 'rgba(98,65,190,0.18)',
        border: '1px solid rgba(130,103,203,0.28)',
        color: 'rgba(200,185,252,0.85)',
      }}
    >
      {label}
    </span>
  )
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-14">
      <p
        className="text-[9px] font-mono tracking-[0.5em] uppercase mb-3"
        style={{ color: 'rgba(130,103,203,0.65)' }}
      >
        {eyebrow}
      </p>
      <h2
        className="text-4xl md:text-5xl font-black text-white leading-tight"
        style={{ fontFamily: "'Big Shoulders Display', sans-serif", letterSpacing: '-0.02em' }}
      >
        {title}
      </h2>
    </div>
  )
}

// ── Skill bar ─────────────────────────────────────────────────────────────────
function SkillBar({ name, pct }: { name: string; pct: number }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{name}</span>
        <span className="text-[10px] font-mono" style={{ color: 'rgba(130,103,203,0.8)' }}>{pct}%</span>
      </div>
      <div className="h-[3px] rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, rgba(59,39,114,0.9) 0%, rgba(130,103,203,0.95) 100%)',
            boxShadow: '0 0 10px rgba(130,103,203,0.45)',
            transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
    </div>
  )
}

// ── Arrow icon ────────────────────────────────────────────────────────────────
function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M1.5 9.5L9.5 1.5M9.5 1.5H3.5M9.5 1.5V7.5" stroke="rgba(210,195,252,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Main Portfolio ────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [activeNav, setActiveNav] = useState('')

  const SKILLS = [
    {
      category: 'Frontend',
      items: [
        { name: 'React / Next.js', pct: 92 },
        { name: 'TypeScript', pct: 88 },
        { name: 'CSS / Tailwind', pct: 90 },
      ],
    },
    {
      category: 'Backend',
      items: [
        { name: 'Node.js / Express', pct: 85 },
        { name: 'Python / FastAPI', pct: 78 },
        { name: 'PostgreSQL', pct: 80 },
      ],
    },
    {
      category: 'Tools',
      items: [
        { name: 'Git / GitHub', pct: 95 },
        { name: 'Docker', pct: 72 },
        { name: 'Figma', pct: 68 },
      ],
    },
    {
      category: 'Badminton 🏸',
      items: [
        { name: 'Smash Power', pct: 96 },
        { name: 'Footwork', pct: 91 },
        { name: 'Court Strategy', pct: 88 },
      ],
    },
  ]

  const SERVICES = [
    {
      title: 'Frontend Development',
      desc: 'Responsive, performant interfaces with React and TypeScript. Pixel-perfect and blazing fast.',
      tags: ['React', 'TypeScript', 'Tailwind', 'Vite'],
    },
    {
      title: 'Backend Engineering',
      desc: 'RESTful APIs and server-side logic using Node.js and Python. Scalable by design.',
      tags: ['Node.js', 'Express', 'Python', 'REST'],
    },
    {
      title: 'Database & DevOps',
      desc: 'Data modelling, query optimisation, and deployment pipelines from schema to CI/CD.',
      tags: ['PostgreSQL', 'MongoDB', 'Docker', 'Git'],
    },
  ]

  const PROJECTS = [
    {
      num: '01',
      title: 'Portfolio Gateway',
      desc: 'This interactive portfolio — multilingual scroll-driven animation, live space starfield, and glassmorphism UI built from scratch.',
      tags: ['React', 'TypeScript', 'Tailwind', 'Canvas API'],
      link: '#',
    },
    {
      num: '02',
      title: 'Court Tracker',
      desc: 'Full-stack tournament management system for badminton leagues. Real-time scoring, brackets, and player stats dashboard.',
      tags: ['Node.js', 'PostgreSQL', 'React', 'Socket.io'],
      link: '#',
    },
    {
      num: '03',
      title: 'API Forge CLI',
      desc: 'REST API scaffolding tool that generates controllers, models, routes and documentation from a single config file.',
      tags: ['Python', 'FastAPI', 'Docker', 'CLI'],
      link: '#',
    },
  ]

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── SVG Liquid Glass Distortion Filter ─────────────────────────── */}
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          <filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
            <feDisplacementMap in="SourceGraphic" in2="blurred" scale="55" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 px-4 md:px-6 py-4">
        <Glass tint="dark" className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between px-5 py-4">
            <a href="#" className="text-white font-black text-xl select-none" style={{ fontFamily: "'Big Shoulders Display', sans-serif", letterSpacing: '-0.01em' }}>
              VARUN<span style={{ color: '#8267cb' }}>.</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {['About', 'Skills', 'Projects', 'Contact'].map(link => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ color: activeNav === link ? '#a18dd8' : 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={() => setActiveNav(link)}
                  onMouseLeave={() => setActiveNav('')}
                >
                  {link}
                </a>
              ))}
              <a
                href="#contact"
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(98,65,190,0.22)',
                  border: '1px solid rgba(130,103,203,0.45)',
                  color: 'rgba(210,195,255,0.9)',
                  boxShadow: '0 0 20px rgba(98,65,190,0.15)',
                }}
              >
                Hire Me
              </a>
            </div>
          </div>
        </Glass>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-32 pb-32">

        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <section id="about" className="pt-12 grid md:grid-cols-5 gap-5 items-stretch min-h-[88vh]">

          {/* Bio card — 3 cols */}
          <Glass tint="dark" className="md:col-span-3 flex flex-col">
            <div className="p-10 md:p-12 flex flex-col h-full justify-between">
              <div>
                <p className="text-[9px] font-mono tracking-[0.5em] uppercase mb-6" style={{ color: 'rgba(130,103,203,0.6)' }}>
                  Portfolio · 2025
                </p>
                <h1
                  className="font-black leading-[0.88] text-white mb-7"
                  style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: 'clamp(52px,7vw,96px)' }}
                >
                  FULL-<br />STACK<br />
                  <span style={{ color: '#8267cb' }}>DEV.</span>
                </h1>
                <p className="text-[15px] leading-relaxed mb-10 max-w-md" style={{ color: 'rgba(255,255,255,0.38)' }}>
                  Crafting elegant digital experiences with clean code and creative precision.
                  10&nbsp;+ years of badminton discipline — sharpened into engineering focus.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href="#projects"
                    className="px-7 py-[14px] rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                    style={{ background: 'rgba(98,65,190,0.85)', color: 'white', boxShadow: '0 0 30px rgba(98,65,190,0.45)' }}
                  >
                    View Projects →
                  </a>
                  <a
                    href="#contact"
                    className="px-7 py-[14px] rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)' }}
                  >
                    Get in Touch
                  </a>
                </div>
              </div>

              {/* Social links */}
              <div className="flex gap-6 mt-10">
                {[
                  { label: 'GitHub',   href: 'https://github.com/varun047' },
                  { label: 'LinkedIn', href: '#' },
                  { label: 'Twitter',  href: '#' },
                ].map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono tracking-widest transition-colors duration-200 hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </Glass>

          {/* Right column — avatar + stats */}
          <div className="md:col-span-2 flex flex-col gap-5">

            {/* Avatar card */}
            <Glass tint="purple" className="flex-1">
              <div className="relative h-full min-h-[240px] flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(130,103,203,0.5) 0%, transparent 68%)' }}
                />
                {/* Concentric ring decoration */}
                {[160, 120, 80].map((size, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full border"
                    style={{
                      width: size, height: size,
                      borderColor: `rgba(130,103,203,${0.08 + i * 0.06})`,
                    }}
                  />
                ))}
                {/* Initials */}
                <div
                  className="relative z-10 w-28 h-28 rounded-full flex items-center justify-center text-white font-black"
                  style={{
                    fontSize: '2.8rem',
                    fontFamily: "'Big Shoulders Display', sans-serif",
                    background: 'rgba(59,39,114,0.5)',
                    border: '2px solid rgba(130,103,203,0.5)',
                    boxShadow: '0 0 60px rgba(98,65,190,0.5), inset 0 0 30px rgba(98,65,190,0.2)',
                  }}
                >
                  V
                </div>
              </div>
            </Glass>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { num: '10+', label: 'Yrs Badminton' },
                { num: '20+', label: 'Projects'      },
                { num: '2K+', label: 'Commits'       },
              ].map(stat => (
                <Glass key={stat.label} tint="dark">
                  <div className="p-5 text-center">
                    <div
                      className="text-3xl font-black text-white mb-1"
                      style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
                    >
                      {stat.num}
                    </div>
                    <div className="text-[9px] font-mono tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {stat.label}
                    </div>
                  </div>
                </Glass>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES ───────────────────────────────────────────────────── */}
        <section>
          <SectionHeading eyebrow="Services" title="What I Do" />
          <div className="grid md:grid-cols-3 gap-5">
            {SERVICES.map(card => (
              <Glass key={card.title} hover tint="dark">
                <div className="p-8 flex flex-col h-full">
                  {/* Hex icon */}
                  <div className="mb-7">
                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                      <path d="M19 3L34 11.5V28.5L19 37L4 28.5V11.5L19 3Z" stroke="rgba(130,103,203,0.7)" strokeWidth="1.5" fill="rgba(98,65,190,0.12)" />
                      <path d="M19 11L26.5 15.5V24.5L19 29L11.5 24.5V15.5L19 11Z" fill="rgba(98,65,190,0.2)" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{card.title}</h3>
                  <p className="text-sm leading-relaxed flex-1 mb-7" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {card.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map(t => <Tag key={t} label={t} />)}
                  </div>
                </div>
              </Glass>
            ))}
          </div>
        </section>

        {/* ── SKILLS ─────────────────────────────────────────────────────── */}
        <section id="skills">
          <SectionHeading eyebrow="Expertise" title="Skills & Tools" />
          <Glass tint="dark">
            <div className="p-10 md:p-12 grid md:grid-cols-2 gap-x-16 gap-y-12">
              {SKILLS.map(group => (
                <div key={group.category}>
                  <p className="text-[9px] font-mono tracking-[0.5em] uppercase mb-6" style={{ color: 'rgba(130,103,203,0.6)' }}>
                    {group.category}
                  </p>
                  <div className="space-y-5">
                    {group.items.map(s => <SkillBar key={s.name} name={s.name} pct={s.pct} />)}
                  </div>
                </div>
              ))}
            </div>
          </Glass>
        </section>

        {/* ── PROJECTS ───────────────────────────────────────────────────── */}
        <section id="projects">
          <SectionHeading eyebrow="Work" title="Featured Projects" />
          <div className="grid md:grid-cols-3 gap-5">
            {PROJECTS.map(proj => (
              <Glass key={proj.num} hover tint="dark" className="group">
                <div className="p-8 flex flex-col h-full">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-8">
                    <span
                      className="text-6xl font-black leading-none select-none"
                      style={{
                        color: 'rgba(255,255,255,0.05)',
                        fontFamily: "'Big Shoulders Display', sans-serif",
                      }}
                    >
                      {proj.num}
                    </span>
                    <a
                      href={proj.link}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                      style={{
                        background: 'rgba(98,65,190,0.18)',
                        border: '1px solid rgba(130,103,203,0.3)',
                        boxShadow: '0 0 0 rgba(98,65,190,0)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 20px rgba(98,65,190,0.4)')}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 rgba(98,65,190,0)')}
                    >
                      <ArrowIcon />
                    </a>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{proj.title}</h3>
                  <p className="text-sm leading-relaxed flex-1 mb-7" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {proj.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {proj.tags.map(t => <Tag key={t} label={t} />)}
                  </div>
                </div>
              </Glass>
            ))}
          </div>
        </section>

        {/* ── CONTACT ────────────────────────────────────────────────────── */}
        <section id="contact">
          <div className="max-w-2xl mx-auto">
            <SectionHeading eyebrow="Get in Touch" title="Let's Work Together" />
            <Glass tint="dark">
              <div className="p-10 md:p-12">
                <p className="text-sm mb-9 leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Whether it's a new project, a collaboration, or just a badminton match —
                  I'm open. Drop a message and I'll get back within 24 hours.
                </p>
                <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { placeholder: 'Your Name',  type: 'text'  },
                      { placeholder: 'Your Email', type: 'email' },
                    ].map(f => (
                      <input
                        key={f.placeholder}
                        type={f.type}
                        placeholder={f.placeholder}
                        className="w-full px-5 py-4 rounded-2xl text-sm outline-none transition-all duration-300 placeholder:text-white/20"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' }}
                        onFocus={e  => { e.target.style.borderColor = 'rgba(130,103,203,0.5)'; e.target.style.boxShadow = '0 0 20px rgba(98,65,190,0.12)' }}
                        onBlur={e   => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
                      />
                    ))}
                  </div>
                  <textarea
                    rows={5}
                    placeholder="Your Message..."
                    className="w-full px-5 py-4 rounded-2xl text-sm outline-none resize-none transition-all duration-300 placeholder:text-white/20"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' }}
                    onFocus={e  => { e.target.style.borderColor = 'rgba(130,103,203,0.5)'; e.target.style.boxShadow = '0 0 20px rgba(98,65,190,0.12)' }}
                    onBlur={e   => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
                  />
                  <button
                    type="submit"
                    className="w-full py-[15px] rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.015]"
                    style={{ background: 'rgba(98,65,190,0.85)', color: 'white', boxShadow: '0 0 30px rgba(98,65,190,0.4)' }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(98,65,190,0.7)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(98,65,190,0.4)')}
                  >
                    Send Message →
                  </button>
                </form>
              </div>
            </Glass>
          </div>
        </section>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <div
        className="text-center py-8 text-[9px] font-mono tracking-[0.4em] uppercase"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.14)' }}
      >
        © 2025 Varun · Built with React + Tailwind · All Rights Reserved
      </div>
    </div>
  )
}
