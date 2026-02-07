"use client"

import { useEffect, useRef, useState, useCallback } from "react"

// Generative ambient soundscape using Web Audio API
// Creates binaural beats + soft drones + evolving harmonics
// Designed to create focus and keep visitors engaged

export function useAmbientAudio() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)

  const createPinkNoise = useCallback((ctx: AudioContext) => {
    const bufferSize = 2 * ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = buffer.getChannelData(0)

    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.969 * b2 + white * 0.153852
      b3 = 0.8665 * b3 + white * 0.3104856
      b4 = 0.55 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.016898
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05
      b6 = white * 0.115926
    }
    return buffer
  }, [])

  const start = useCallback(async () => {
    if (audioContextRef.current) return

    const ctx = new AudioContext()
    audioContextRef.current = ctx

    // Master gain
    const masterGain = ctx.createGain()
    masterGain.gain.value = volume
    masterGain.connect(ctx.destination)
    gainNodeRef.current = masterGain

    // Binaural beat carrier (creates focus state - 10Hz alpha wave)
    // Left ear: 200Hz, Right ear: 210Hz = 10Hz difference
    const leftOsc = ctx.createOscillator()
    const rightOsc = ctx.createOscillator()
    const leftGain = ctx.createGain()
    const rightGain = ctx.createGain()
    const merger = ctx.createChannelMerger(2)

    leftOsc.frequency.value = 200
    rightOsc.frequency.value = 210
    leftOsc.type = "sine"
    rightOsc.type = "sine"
    leftGain.gain.value = 0.15
    rightGain.gain.value = 0.15

    leftOsc.connect(leftGain)
    rightOsc.connect(rightGain)
    leftGain.connect(merger, 0, 0)
    rightGain.connect(merger, 0, 1)
    merger.connect(masterGain)

    leftOsc.start()
    rightOsc.start()
    oscillatorsRef.current.push(leftOsc, rightOsc)

    // Deep sub drone (warmth)
    const subDrone = ctx.createOscillator()
    const subGain = ctx.createGain()
    subDrone.frequency.value = 55 // A1 - very low
    subDrone.type = "sine"
    subGain.gain.value = 0.1
    subDrone.connect(subGain)
    subGain.connect(masterGain)
    subDrone.start()
    oscillatorsRef.current.push(subDrone)

    // Evolving pad (harmonic movement)
    const padOsc = ctx.createOscillator()
    const padGain = ctx.createGain()
    const padFilter = ctx.createBiquadFilter()
    padOsc.type = "triangle"
    padOsc.frequency.value = 220
    padFilter.type = "lowpass"
    padFilter.frequency.value = 800
    padFilter.Q.value = 1
    padGain.gain.value = 0.08

    padOsc.connect(padFilter)
    padFilter.connect(padGain)
    padGain.connect(masterGain)
    padOsc.start()
    oscillatorsRef.current.push(padOsc)

    // Slowly modulate the pad frequency for movement
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.05 // Very slow
    lfoGain.gain.value = 30
    lfo.connect(lfoGain)
    lfoGain.connect(padOsc.frequency)
    lfo.start()
    oscillatorsRef.current.push(lfo)

    // Pink noise for texture (very subtle)
    const noiseBuffer = createPinkNoise(ctx)
    const noise = ctx.createBufferSource()
    const noiseGain = ctx.createGain()
    const noiseFilter = ctx.createBiquadFilter()
    noise.buffer = noiseBuffer
    noise.loop = true
    noiseFilter.type = "lowpass"
    noiseFilter.frequency.value = 400
    noiseGain.gain.value = 0.03

    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(masterGain)
    noise.start()
    noiseNodeRef.current = noise

    // High shimmer (subtle presence)
    const shimmer = ctx.createOscillator()
    const shimmerGain = ctx.createGain()
    const shimmerFilter = ctx.createBiquadFilter()
    shimmer.frequency.value = 880
    shimmer.type = "sine"
    shimmerFilter.type = "highpass"
    shimmerFilter.frequency.value = 600
    shimmerGain.gain.value = 0.02

    shimmer.connect(shimmerFilter)
    shimmerFilter.connect(shimmerGain)
    shimmerGain.connect(masterGain)
    shimmer.start()
    oscillatorsRef.current.push(shimmer)

    // Subtle shimmer modulation
    const shimmerLfo = ctx.createOscillator()
    const shimmerLfoGain = ctx.createGain()
    shimmerLfo.frequency.value = 0.1
    shimmerLfoGain.gain.value = 0.01
    shimmerLfo.connect(shimmerLfoGain)
    shimmerLfoGain.connect(shimmerGain.gain)
    shimmerLfo.start()
    oscillatorsRef.current.push(shimmerLfo)

    setIsPlaying(true)
  }, [volume, createPinkNoise])

  const stop = useCallback(() => {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop()
      } catch (e) {}
    })
    oscillatorsRef.current = []

    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop()
      } catch (e) {}
      noiseNodeRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    gainNodeRef.current = null
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop()
    } else {
      start()
    }
  }, [isPlaying, start, stop])

  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume
    }
  }, [])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return { isPlaying, toggle, volume, setVolume: updateVolume }
}
