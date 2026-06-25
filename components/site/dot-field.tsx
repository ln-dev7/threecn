"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const TWO_PI = Math.PI * 2

type Dot = { ax: number; ay: number; sx: number; sy: number }

/**
 * A cursor-reactive grid of dots rendered on a 2D canvas. Dots bulge away from
 * the pointer and a soft glow follows it. The gradient is read from the live
 * `--primary` token, so it stays on-theme (and follows dark-mode toggles).
 *
 * Adapted from the React Bits "DotField" hero background.
 */
export function DotField({
  className,
  dotRadius = 1.6,
  dotSpacing = 16,
  cursorRadius = 190,
  bulgeStrength = 42,
}: {
  className?: string
  dotRadius?: number
  dotSpacing?: number
  cursorRadius?: number
  bulgeStrength?: number
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let dots: Dot[] = []
    const size = { w: 0, h: 0 }
    const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, speed: 0 }
    let engagement = 0
    let glow = 0
    let raf = 0

    // Theme colors, refreshed on mount + when the .dark class changes.
    let gradFrom = "rgba(168,85,247,0.4)"
    let gradTo = "rgba(180,151,207,0.25)"
    let glowColor = "rgba(168,85,247,0.25)"

    function readTheme() {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim()
      const m = raw.match(/^(-?[\d.]+)\s+(-?[\d.]+)%\s+(-?[\d.]+)%/)
      if (!m) return
      const h = m[1]
      const s = m[2]
      const l = m[3]
      gradFrom = `hsla(${h}, ${s}%, ${l}%, 0.42)`
      gradTo = `hsla(${h}, ${Math.max(0, +s - 20)}%, ${Math.min(100, +l + 12)}%, 0.22)`
      glowColor = `hsla(${h}, ${s}%, ${l}%, 0.22)`
    }

    function buildDots() {
      const step = dotRadius + dotSpacing
      const cols = Math.floor(size.w / step)
      const rows = Math.floor(size.h / step)
      const padX = (size.w % step) / 2
      const padY = (size.h % step) / 2
      const next: Dot[] = new Array(rows * cols)
      let i = 0
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ax = padX + c * step + step / 2
          const ay = padY + r * step + step / 2
          next[i++] = { ax, ay, sx: ax, sy: ay }
        }
      }
      dots = next
    }

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect()
      size.w = rect.width
      size.h = rect.height
      canvas!.width = size.w * dpr
      canvas!.height = size.h * dpr
      canvas!.style.width = `${size.w}px`
      canvas!.style.height = `${size.h}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildDots()
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    function onLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    const speedTimer = window.setInterval(() => {
      const dx = mouse.px - mouse.x
      const dy = mouse.py - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      mouse.speed += (dist - mouse.speed) * 0.5
      if (mouse.speed < 0.001) mouse.speed = 0
      mouse.px = mouse.x
      mouse.py = mouse.y
    }, 20)

    function tick() {
      const { w, h } = size
      const target = Math.min(mouse.speed / 5, 1)
      engagement += (target - engagement) * 0.06
      if (engagement < 0.001) engagement = 0
      glow += (engagement - glow) * 0.08

      ctx!.clearRect(0, 0, w, h)

      // soft glow following the cursor
      if (glow > 0.01 && mouse.x > -9000) {
        const g = ctx!.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          cursorRadius
        )
        g.addColorStop(0, glowColor)
        g.addColorStop(1, "rgba(0,0,0,0)")
        ctx!.globalAlpha = glow
        ctx!.fillStyle = g
        ctx!.fillRect(0, 0, w, h)
        ctx!.globalAlpha = 1
      }

      const grad = ctx!.createLinearGradient(0, 0, w, h)
      grad.addColorStop(0, gradFrom)
      grad.addColorStop(1, gradTo)
      ctx!.fillStyle = grad

      const crSq = cursorRadius * cursorRadius
      const rad = dotRadius / 2
      ctx!.beginPath()
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]
        const dx = mouse.x - d.ax
        const dy = mouse.y - d.ay
        const distSq = dx * dx + dy * dy
        if (distSq < crSq && engagement > 0.01) {
          const dist = Math.sqrt(distSq)
          const f = 1 - dist / cursorRadius
          const push = f * f * bulgeStrength * engagement
          const angle = Math.atan2(dy, dx)
          d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15
          d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15
        } else {
          d.sx += (d.ax - d.sx) * 0.1
          d.sy += (d.ay - d.sy) * 0.1
        }
        ctx!.moveTo(d.sx + rad, d.sy)
        ctx!.arc(d.sx, d.sy, rad, 0, TWO_PI)
      }
      ctx!.fill()

      raf = requestAnimationFrame(tick)
    }

    readTheme()
    resize()
    tick()

    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)
    window.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerleave", onLeave)
    const themeObserver = new MutationObserver(readTheme)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    })

    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(speedTimer)
      window.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerleave", onLeave)
      ro.disconnect()
      themeObserver.disconnect()
    }
  }, [dotRadius, dotSpacing, cursorRadius, bulgeStrength])

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
