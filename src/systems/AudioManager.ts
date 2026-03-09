import { MUSIC } from '../data/music'
import { SE } from '../data/sounds'

class AudioManagerImpl {
  private currentAudio: HTMLAudioElement | null = null
  private currentTrackId: string | null = null
  private volume = 0.4
  private seVolume = 0.5
  private fadeInterval: ReturnType<typeof setInterval> | null = null
  private sePool: Map<string, HTMLAudioElement[]> = new Map()

  play(trackId: string, fadeIn = 1000) {
    if (this.currentTrackId === trackId) return

    const track = MUSIC[trackId]
    if (!track) {
      console.warn(`Music track not found: ${trackId}`)
      return
    }

    // Stop current track
    this.stopFade()
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio = null
    }

    const audio = new Audio(track.path)
    audio.loop = true
    audio.volume = 0
    this.currentAudio = audio
    this.currentTrackId = trackId

    audio.play().catch(() => {
      // Autoplay blocked — will retry on user interaction
    })

    // Fade in
    if (fadeIn > 0) {
      const steps = 20
      const stepTime = fadeIn / steps
      const stepVol = this.volume / steps
      let currentVol = 0
      this.fadeInterval = setInterval(() => {
        currentVol = Math.min(this.volume, currentVol + stepVol)
        if (this.currentAudio) this.currentAudio.volume = currentVol
        if (currentVol >= this.volume) this.stopFade()
      }, stepTime)
    } else {
      audio.volume = this.volume
    }
  }

  stop(fadeOut = 800) {
    if (!this.currentAudio) return
    this.stopFade()

    const audio = this.currentAudio
    if (fadeOut > 0) {
      const steps = 20
      const stepTime = fadeOut / steps
      const stepVol = audio.volume / steps
      this.fadeInterval = setInterval(() => {
        const newVol = Math.max(0, audio.volume - stepVol)
        audio.volume = newVol
        if (newVol <= 0) {
          this.stopFade()
          audio.pause()
        }
      }, stepTime)
    } else {
      audio.pause()
    }

    this.currentTrackId = null
    this.currentAudio = null
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol))
    if (this.currentAudio && !this.fadeInterval) {
      this.currentAudio.volume = this.volume
    }
  }

  getVolume() {
    return this.volume
  }

  getCurrentTrackId() {
    return this.currentTrackId
  }

  /** Play a sound effect (fire-and-forget, pooled) */
  playSE(seId: string) {
    const path = SE[seId]
    if (!path) return

    let pool = this.sePool.get(seId)
    if (!pool) {
      pool = []
      this.sePool.set(seId, pool)
    }

    // Find an idle audio element or create a new one
    let audio = pool.find((a) => a.ended || a.paused)
    if (!audio) {
      audio = new Audio(path)
      pool.push(audio)
    }
    audio.currentTime = 0
    audio.volume = this.seVolume
    audio.play().catch(() => {})
  }

  setSEVolume(vol: number) {
    this.seVolume = Math.max(0, Math.min(1, vol))
  }

  getSEVolume() {
    return this.seVolume
  }

  /** Resume audio after user interaction (for autoplay policy) */
  resume() {
    if (this.currentAudio?.paused && this.currentTrackId) {
      this.currentAudio.play().catch(() => {})
    }
  }

  private stopFade() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval)
      this.fadeInterval = null
    }
  }
}

export const AudioManager = new AudioManagerImpl()
