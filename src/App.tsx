import { useState, useEffect, useRef, useCallback } from 'react'
import Portfolio from './Portfolio'

const TRANSLATIONS = [
  { word: 'WELCOME',      lang: 'English'  },
  { word: 'BIENVENUE',    lang: 'French'   },
  { word: 'BIENVENIDO',   lang: 'Spanish'  },
  { word: 'WILLKOMMEN',   lang: 'German'   },
  { word: 'BENVENUTO',    lang: 'Italian'  },
  { word: '欢迎',          lang: 'Chinese'  },
  { word: 'ਸੁਆਗਤ',        lang: 'Punjabi'  },
  { word: 'HOŞ GELDİNİZ', lang: 'Turkish'  },
]

const ACCEL_FADE_MS = 95   // fast fade during first-scroll acceleration
const IDLE_FADE_MS  = 460  // normal fade duration during breathing loop
const IDLE_HOLD_MS  = 2800 // how long each language is visible in idle
const CTA_FADE_MS   = 520  // cinematic reveal into static CTA

/** Slot durations (ms) — fastest at the end for an accelerating identity sweep */
function buildAccelSlots(remaining: number): number[] {
  if (remaining <= 0) return []
  const start = 640
  const end = 165
  return Array.from({ length: remaining }, (_, i) => {
    const t = remaining === 1 ? 1 : i / (remaining - 1)
    return Math.round(start - (start - end) * t)
  })
}

interface Particle {
  x: number; y: number; baseX: number; baseY: number
  size: number; angle: number; breathSpeed: number; speedFactor: number
}

function segmentWord(word: string): string[] {
  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    const seg = new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' })
    return Array.from(seg.segment(word)).map((s: any) => s.segment)
  }
  return word.split('')
}

type Phase = 'idle' | 'accelerating' | 'done'

export default function App() {
  const [currentIdx,  setCurrentIdx]  = useState(0)
  const [wordVisible, setWordVisible] = useState(true)
  const [animKey,     setAnimKey]     = useState(0)
  const [phase,       setPhase]       = useState<Phase>('idle')
  const [parallaxY,   setParallaxY]   = useState(0)
  const [showCTA,     setShowCTA]     = useState(false)

  const phaseRef      = useRef<Phase>('idle')
  const currentIdxRef = useRef(0)
  const animKeyRef    = useRef(0)
  const idleTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const accelTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const [accelDurationMs, setAccelDurationMs] = useState(2600)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef  = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  // ── Helpers ────────────────────────────────────────────────────────────────
  const stopIdleScheduler = useCallback(() => {
    if (idleTimerRef.current) { clearTimeout(idleTimerRef.current); idleTimerRef.current = null }
  }, [])

  const clearAccelTimers = useCallback(() => {
    accelTimersRef.current.forEach(clearTimeout)
    accelTimersRef.current = []
  }, [])

  const scheduleAccel = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    accelTimersRef.current.push(id)
    return id
  }, [])

  // Slow idle-mode transition (breathing feel)
  const idleTransitionTo = useCallback((nextIdx: number, onDone?: () => void) => {
    setWordVisible(false)
    setParallaxY(-22)

    setTimeout(() => {
      currentIdxRef.current = nextIdx
      setCurrentIdx(nextIdx)
      animKeyRef.current += 1
      setAnimKey(animKeyRef.current)
      setParallaxY(20)
    }, IDLE_FADE_MS)

    setTimeout(() => {
      setWordVisible(true)
      setParallaxY(0)
      setTimeout(() => onDone?.(), 600)
    }, IDLE_FADE_MS + 180)
  }, [])

  // ── Idle breathing loop ────────────────────────────────────────────────────
  useEffect(() => {
    const schedule = () => {
      idleTimerRef.current = setTimeout(() => {
        if (phaseRef.current !== 'idle') return
        const next = (currentIdxRef.current + 1) % TRANSLATIONS.length
        idleTransitionTo(next, () => {
          if (phaseRef.current === 'idle') schedule()
        })
      }, IDLE_HOLD_MS)
    }

    idleTimerRef.current = setTimeout(() => {
      if (phaseRef.current === 'idle') schedule()
    }, IDLE_HOLD_MS)

    return () => stopIdleScheduler()
  }, [idleTransitionTo, stopIdleScheduler])

  // ── Acceleration sequence — fires once on first scroll ────────────────────
  const runAccelerationSequence = useCallback(() => {
    clearAccelTimers()

    const startIdx = currentIdxRef.current
    const remaining = TRANSLATIONS.length - 1 - startIdx
    const slots = buildAccelSlots(remaining)
    const totalMs =
      slots.reduce((a, b) => a + b, 0) +
      remaining * ACCEL_FADE_MS +
      CTA_FADE_MS
    setAccelDurationMs(totalMs)

    const revealCTA = () => {
      setWordVisible(false)
      setParallaxY(-34)
      scheduleAccel(() => {
        setShowCTA(true)
        animKeyRef.current += 1
        setAnimKey(animKeyRef.current)
        setParallaxY(0)
        setWordVisible(true)
        phaseRef.current = 'done'
        setPhase('done')
      }, CTA_FADE_MS * 0.55)
    }

    if (remaining <= 0) {
      revealCTA()
      return
    }

    let step = 0

    const cycleNext = () => {
      const nextIdx = currentIdxRef.current + 1
      if (nextIdx >= TRANSLATIONS.length) {
        scheduleAccel(revealCTA, 120)
        return
      }

      const slotMs = slots[Math.min(step, slots.length - 1)]
      const driftOut = -14 - step * 2.5
      const driftIn = 12 + step * 1.5

      setWordVisible(false)
      setParallaxY(driftOut)

      scheduleAccel(() => {
        currentIdxRef.current = nextIdx
        setCurrentIdx(nextIdx)
        animKeyRef.current += 1
        setAnimKey(animKeyRef.current)
        setParallaxY(driftIn)
        setWordVisible(true)
      }, ACCEL_FADE_MS)

      scheduleAccel(() => setParallaxY(0), ACCEL_FADE_MS + 90)
      scheduleAccel(() => {
        step += 1
        cycleNext()
      }, slotMs)
    }

    cycleNext()
  }, [clearAccelTimers, scheduleAccel])

  // ── First-scroll detection — passive only, never blocks scroll ────────────
  useEffect(() => {
    let triggered = false

    const trigger = () => {
      if (triggered || phaseRef.current !== 'idle') return
      triggered = true
      stopIdleScheduler()
      phaseRef.current = 'accelerating'
      setPhase('accelerating')
      runAccelerationSequence()
      detach()
    }

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) trigger()
    }
    const onScroll = () => {
      if (window.scrollY > 4) trigger()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) trigger()
    }

    const detach = () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKeyDown)
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      detach()
      clearAccelTimers()
    }
  }, [runAccelerationSequence, stopIdleScheduler, clearAccelTimers])

  // ── Fixed starfield + Siri wave canvas ─────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let particles: Particle[] = []

    mouseRef.current = {
      x: window.innerWidth / 2, y: window.innerHeight / 2,
      targetX: window.innerWidth / 2, targetY: window.innerHeight / 2,
    }

    const init = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      particles = []
      for (let i = 0; i < 160; i++) {
        const x = Math.random() * canvas.width, y = Math.random() * canvas.height
        particles.push({
          x, y, baseX: x, baseY: y,
          size:        0.3 + Math.random() * 1.4,
          angle:       Math.random() * Math.PI * 2,
          breathSpeed: 0.004 + Math.random() * 0.012,
          speedFactor: 0.03  + Math.random() * 0.05,
        })
      }
    }
    init()

    let driftX = 0, driftY = 0, wP = [0, 0, 0]

    const draw = () => {
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const m = mouseRef.current
      m.x += (m.targetX - m.x) * 0.08; m.y += (m.targetY - m.y) * 0.08
      driftX += ((m.x - canvas.width / 2) * 0.04 - driftX) * 0.04
      driftY += ((m.y - canvas.height / 2) * 0.04 - driftY) * 0.04

      for (const p of particles) {
        p.angle += p.breathSpeed
        const op = 0.15 + Math.abs(Math.sin(p.angle)) * 0.7
        const sz = p.size * (0.9 + Math.abs(Math.sin(p.angle)) * 0.25)
        const df = p.size / 1.7
        const hX = p.baseX + driftX * df, hY = p.baseY + driftY * df
        const dx = m.x - p.x, dy = m.y - p.y, dst = Math.sqrt(dx*dx + dy*dy)

        if (dst < 180) {
          const f = (180 - dst) / 180, a = Math.atan2(dy, dx)
          p.x += Math.cos(a) * f * 1.5; p.y += Math.sin(a) * f * 1.5
        } else {
          p.x += (hX - p.x) * p.speedFactor; p.y += (hY - p.y) * p.speedFactor
        }

        ctx.beginPath(); ctx.arc(p.x, p.y, sz, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${op})`; ctx.fill()
      }

      wP[0] += 0.012; wP[1] -= 0.018; wP[2] += 0.025
      const cY = canvas.height / 2 + driftY * 0.4
      const hB = Math.max(0, 1 - Math.abs(m.y - canvas.height / 2) / (canvas.height / 2))

      ;[
        { ph: wP[0], amp: 45+hB*25, fr: 0.004, c: 'rgba(130,103,203,0.45)', lw: 2.5 },
        { ph: wP[1], amp: 30+hB*15, fr: 0.008, c: 'rgba(165,147,210,0.35)', lw: 1.5 },
        { ph: wP[2], amp: 15+hB*10, fr: 0.015, c: 'rgba(98,65,190,0.25)',   lw: 1.0 },
      ].forEach(w => {
        ctx.beginPath(); ctx.lineWidth = w.lw
        const g = ctx.createLinearGradient(0, 0, canvas.width, 0)
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, w.c); g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.strokeStyle = g; ctx.shadowBlur = 15; ctx.shadowColor = w.c
        for (let x = 0; x < canvas.width; x += 2) {
          const pf = Math.sin((x / canvas.width) * Math.PI)
          const y  = cY + Math.sin(x * w.fr + w.ph) * w.amp * pf
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke(); ctx.shadowBlur = 0
      })

      raf = requestAnimationFrame(draw)
    }
    draw()

    const onMove   = (e: MouseEvent) => { mouseRef.current.targetX = e.clientX; mouseRef.current.targetY = e.clientY }
    const onResize = () => init()
    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize',    onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); window.removeEventListener('resize', onResize) }
  }, [])

  // ── Derived render values ──────────────────────────────────────────────────
  const translation = TRANSLATIONS[currentIdx]
  const letters     = segmentWord(translation.word)

  // Transition speed adapts to phase
  const isAccel      = phase === 'accelerating'
  const fadeMs       = isAccel ? ACCEL_FADE_MS : 450
  const transitionStyle = `opacity ${fadeMs}ms ease, filter ${fadeMs}ms ease, transform ${isAccel ? '0.25s' : '0.62s'} cubic-bezier(0.16,1,0.3,1)`

  // Slight extra motion blur during acceleration
  const blurAmount = !wordVisible
    ? (isAccel ? `${4 + Math.min(currentIdx, 6)}px` : '14px')
    : '0px'

  const gatewayBreathing = phase === 'idle' && !showCTA

  return (
    <div className="relative bg-black">

      {/* Fixed starfield canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" />

      {/* ── WELCOME GATEWAY — 100vh ──────────────────────────────────────── */}
      <section className="relative z-10 h-screen flex items-center justify-center select-none overflow-hidden">

        {/* Text container — idle breathing wrapper + transition layer */}
        <div className={`relative flex flex-col items-center justify-center pointer-events-none ${gatewayBreathing ? 'gateway-breathe' : ''}`}>
          <div
            className="flex flex-col items-center justify-center"
            style={{
              opacity:    wordVisible ? 1 : 0,
              filter:     `blur(${blurAmount})`,
              transform:  `translateY(${parallaxY}px)`,
              transition: transitionStyle,
            }}
          >
          {showCTA ? (
            /* ── Static cinematic CTA (no language loop, no breathing) ───── */
            <div className="cta-reveal flex flex-col items-center gap-6">
              <h1
                className="text-poster-header text-white text-center leading-none overflow-visible"
                style={{
                  fontSize: 'clamp(52px, 13vw, 210px)',
                  letterSpacing: '-0.02em',
                  textShadow: '0 0 80px rgba(130,103,203,0.5), 0 4px 30px rgba(0,0,0,0.8)',
                }}
              >
                LET&apos;S<br />EXPLORE
              </h1>
              <div
                style={{
                  width: '72px',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(130,103,203,0.75), transparent)',
                }}
              />
            </div>
          ) : (
            /* ── Multilingual WELCOME ─────────────────────────────────────── */
            <>
              <h1
                className="text-poster-header flex items-end justify-center leading-none overflow-visible"
                style={{ fontSize: 'clamp(72px, 18vw, 280px)' }}
              >
                {letters.map((letter, idx) => (
                  <span
                    key={`${animKey}-${idx}`}
                    className={`inline-block text-white ${isAccel ? '' : 'letter-reveal'}`}
                    style={{
                      animationDelay: isAccel ? '0ms' : `${idx * 55}ms`,
                      transformOrigin: 'bottom center',
                      // No stagger in accel mode — instant appearance
                      ...(isAccel ? { display: 'inline-block' } : {}),
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </h1>
              <div
                className="mt-5 font-mono uppercase tracking-[0.55em] text-[9px] transition-opacity duration-200"
                style={{
                  color: 'rgba(210,195,248,0.4)',
                  opacity: isAccel ? Math.max(0.15, 0.55 - currentIdx * 0.06) : 0.4,
                }}
              >
                {translation.lang}
              </div>
            </>
          )}
          </div>
        </div>

        {/* Scroll hint — idle only */}
        {phase === 'idle' && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none">
            <span
              className="text-[8px] font-mono tracking-[0.5em] uppercase scroll-bounce"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              scroll to enter
            </span>
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className="scroll-bounce" style={{ animationDelay: '0.15s' }}>
              <path d="M1 1L6 6L11 1" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {/* Acceleration progress — barely visible thin bar at bottom */}
        {phase === 'accelerating' && (
          <div
            className="absolute bottom-0 left-0 h-[2px] accel-progress"
            style={{
              ['--accel-duration' as string]: `${accelDurationMs}ms`,
              background: 'linear-gradient(90deg, rgba(98,65,190,0.8), rgba(165,147,210,0.6))',
              boxShadow: '0 0 8px rgba(130,103,203,0.6)',
            }}
          />
        )}
      </section>

      {/* ── PORTFOLIO — scrollable below ──────────────────────────────────── */}
      <div className="relative z-10">
        <Portfolio />
      </div>
    </div>
  )
}
