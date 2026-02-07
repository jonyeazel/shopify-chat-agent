"use client"

import { useEffect, useRef } from "react"

function hash(x: number, y: number, z: number): number {
  let h = (x * 374761393 + y * 668265263 + z * 1274126177) | 0
  h = ((h ^ (h >> 13)) * 1274126177) | 0
  return (h & 0x7fffffff) / 0x7fffffff
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

function noise3d(x: number, y: number, z: number): number {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z)
  const fx = smoothstep(x - ix), fy = smoothstep(y - iy), fz = smoothstep(z - iz)

  const a = hash(ix, iy, iz),     b = hash(ix + 1, iy, iz)
  const c = hash(ix, iy + 1, iz), d = hash(ix + 1, iy + 1, iz)
  const e = hash(ix, iy, iz + 1), f = hash(ix + 1, iy, iz + 1)
  const g = hash(ix, iy + 1, iz + 1), h2 = hash(ix + 1, iy + 1, iz + 1)

  const x1 = a + fx * (b - a), x2 = c + fx * (d - c)
  const x3 = e + fx * (f - e), x4 = g + fx * (h2 - g)
  const y1 = x1 + fy * (x2 - x1), y2 = x3 + fy * (x4 - x3)

  return y1 + fz * (y2 - y1)
}

function fbm(x: number, y: number, z: number): number {
  return noise3d(x, y, z) * 0.5
    + noise3d(x * 2, y * 2, z * 2) * 0.3
    + noise3d(x * 4, y * 4, z * 4) * 0.2
}

const W = 48
const H = 96
const FPS = 12
const R = 55, G = 82, B = 63

export function AmbientTexture({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    canvas.width = W
    canvas.height = H

    const imageData = ctx.createImageData(W, H)
    const data = imageData.data
    const interval = 1000 / FPS

    let animId: number
    let lastFrame = 0

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw)
      if (now - lastFrame < interval) return
      lastFrame = now

      const t = now * 0.00002

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const nx = x / W * 6
          const ny = y / H * 6
          const v = fbm(nx, ny, t)
          const alpha = Math.floor(v * v * 35)
          const i = (y * W + x) * 4
          data[i] = R
          data[i + 1] = G
          data[i + 2] = B
          data[i + 3] = alpha
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    animId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ imageRendering: "auto" }}
    />
  )
}
