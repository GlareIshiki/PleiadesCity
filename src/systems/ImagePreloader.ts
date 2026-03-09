import { CHARACTERS } from '../data/characters'
import { BACKGROUNDS } from '../data/backgrounds'

const cache = new Map<string, HTMLImageElement>()

function preloadImage(src: string): Promise<void> {
  if (cache.has(src)) return Promise.resolve()
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      cache.set(src, img)
      resolve()
    }
    img.onerror = () => resolve() // Don't block on missing images
    img.src = src
  })
}

/** Preload all character sprites and background images */
export async function preloadAllImages(
  onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
  const urls: string[] = []

  // Character expressions
  for (const char of Object.values(CHARACTERS)) {
    for (const path of Object.values(char.expressions)) {
      urls.push(path)
    }
  }

  // Backgrounds
  for (const bg of Object.values(BACKGROUNDS)) {
    urls.push(bg.imagePath)
  }

  let loaded = 0
  const total = urls.length

  await Promise.all(
    urls.map((url) =>
      preloadImage(url).then(() => {
        loaded++
        onProgress?.(loaded, total)
      }),
    ),
  )
}

/** Check if an image is already cached */
export function isImageCached(src: string): boolean {
  return cache.has(src)
}
