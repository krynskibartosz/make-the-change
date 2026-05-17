import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const DEFAULT_THRESHOLD = 48
const DEFAULT_NEUTRAL_THRESHOLD = 112
const DEFAULT_CHROMA_THRESHOLD = 28
const DEFAULT_WATERMARK_ZONE_WIDTH_RATIO = 0.18
const DEFAULT_WATERMARK_ZONE_HEIGHT_RATIO = 0.22
const DEFAULT_WATERMARK_MIN_BRIGHTNESS = 96
const DEFAULT_WATERMARK_CHROMA_THRESHOLD = 18
const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])

function parseCliArgs(argv) {
  const options = {
    inputDir: path.resolve('public/images/dioramas/_source'),
    outputDir: path.resolve('public/images/dioramas/transparent'),
    threshold: DEFAULT_THRESHOLD,
    neutralThreshold: DEFAULT_NEUTRAL_THRESHOLD,
    chromaThreshold: DEFAULT_CHROMA_THRESHOLD,
    removeWatermark: true,
  }

  for (const arg of argv) {
    if (arg.startsWith('--threshold=')) {
      const threshold = Number.parseInt(arg.slice('--threshold='.length), 10)
      if (!Number.isInteger(threshold) || threshold < 0 || threshold > 255) {
        throw new Error(`Invalid threshold "${arg}". Expected an integer from 0 to 255.`)
      }
      options.threshold = threshold
      continue
    }

    if (arg.startsWith('--input=')) {
      options.inputDir = path.resolve(arg.slice('--input='.length))
      continue
    }

    if (arg.startsWith('--neutral-threshold=')) {
      const neutralThreshold = Number.parseInt(arg.slice('--neutral-threshold='.length), 10)
      if (!Number.isInteger(neutralThreshold) || neutralThreshold < 0 || neutralThreshold > 255) {
        throw new Error(`Invalid neutral threshold "${arg}". Expected an integer from 0 to 255.`)
      }
      options.neutralThreshold = neutralThreshold
      continue
    }

    if (arg.startsWith('--chroma-threshold=')) {
      const chromaThreshold = Number.parseInt(arg.slice('--chroma-threshold='.length), 10)
      if (!Number.isInteger(chromaThreshold) || chromaThreshold < 0 || chromaThreshold > 255) {
        throw new Error(`Invalid chroma threshold "${arg}". Expected an integer from 0 to 255.`)
      }
      options.chromaThreshold = chromaThreshold
      continue
    }

    if (arg.startsWith('--output=')) {
      options.outputDir = path.resolve(arg.slice('--output='.length))
      continue
    }

    if (arg === '--keep-watermark') {
      options.removeWatermark = false
      continue
    }

    throw new Error(`Unknown argument "${arg}".`)
  }

  return options
}

export function isAlmostBlack(r, g, b, threshold = DEFAULT_THRESHOLD) {
  return r <= threshold && g <= threshold && b <= threshold
}

export function isLowChromaDark(
  r,
  g,
  b,
  neutralThreshold = DEFAULT_NEUTRAL_THRESHOLD,
  chromaThreshold = DEFAULT_CHROMA_THRESHOLD,
) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  return max <= neutralThreshold && max - min <= chromaThreshold
}

export function createEdgeConnectedBackgroundMask({
  data,
  width,
  height,
  channels,
  threshold = DEFAULT_THRESHOLD,
  neutralThreshold = DEFAULT_NEUTRAL_THRESHOLD,
  chromaThreshold = DEFAULT_CHROMA_THRESHOLD,
}) {
  const pixelCount = width * height
  const mask = new Uint8Array(pixelCount)
  const queue = new Int32Array(pixelCount)
  let head = 0
  let tail = 0

  function isDarkPixel(pixelIndex) {
    const dataIndex = pixelIndex * channels
    const r = data[dataIndex]
    const g = data[dataIndex + 1]
    const b = data[dataIndex + 2]
    return (
      isAlmostBlack(r, g, b, threshold) ||
      isLowChromaDark(r, g, b, neutralThreshold, chromaThreshold)
    )
  }

  function enqueue(pixelIndex) {
    if (
      pixelIndex < 0 ||
      pixelIndex >= pixelCount ||
      mask[pixelIndex] ||
      !isDarkPixel(pixelIndex)
    ) {
      return
    }

    mask[pixelIndex] = 1
    queue[tail] = pixelIndex
    tail += 1
  }

  for (let x = 0; x < width; x += 1) {
    enqueue(x)
    enqueue((height - 1) * width + x)
  }

  for (let y = 1; y < height - 1; y += 1) {
    enqueue(y * width)
    enqueue(y * width + width - 1)
  }

  while (head < tail) {
    const pixelIndex = queue[head]
    head += 1

    const x = pixelIndex % width

    if (x > 0) enqueue(pixelIndex - 1)
    if (x < width - 1) enqueue(pixelIndex + 1)
    if (pixelIndex >= width) enqueue(pixelIndex - width)
    if (pixelIndex < pixelCount - width) enqueue(pixelIndex + width)
  }

  return mask
}

export function applyTransparencyMask(data, mask, channels) {
  let transparentPixels = 0

  for (let pixelIndex = 0; pixelIndex < mask.length; pixelIndex += 1) {
    if (!mask[pixelIndex]) continue

    const alphaIndex = pixelIndex * channels + 3
    data[alphaIndex] = 0
    transparentPixels += 1
  }

  return transparentPixels
}

export function clearBottomRightWatermarkPixels(
  data,
  {
    width,
    height,
    channels,
    zoneWidthRatio = DEFAULT_WATERMARK_ZONE_WIDTH_RATIO,
    zoneHeightRatio = DEFAULT_WATERMARK_ZONE_HEIGHT_RATIO,
    minBrightness = DEFAULT_WATERMARK_MIN_BRIGHTNESS,
    chromaThreshold = DEFAULT_WATERMARK_CHROMA_THRESHOLD,
  },
) {
  const startX = Math.max(0, Math.floor(width * (1 - zoneWidthRatio)))
  const startY = Math.max(0, Math.floor(height * (1 - zoneHeightRatio)))
  let clearedPixels = 0

  for (let y = startY; y < height; y += 1) {
    for (let x = startX; x < width; x += 1) {
      const dataIndex = (y * width + x) * channels
      const alphaIndex = dataIndex + 3
      if (data[alphaIndex] === 0) continue

      const r = data[dataIndex]
      const g = data[dataIndex + 1]
      const b = data[dataIndex + 2]
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const isNeutralBright = max >= minBrightness && max - min <= chromaThreshold

      if (!isNeutralBright) continue

      data[alphaIndex] = 0
      clearedPixels += 1
    }
  }

  return clearedPixels
}

export async function processImage({
  inputPath,
  outputPath,
  threshold = DEFAULT_THRESHOLD,
  neutralThreshold = DEFAULT_NEUTRAL_THRESHOLD,
  chromaThreshold = DEFAULT_CHROMA_THRESHOLD,
  removeWatermark = true,
}) {
  const image = sharp(inputPath).ensureAlpha()
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
  const mask = createEdgeConnectedBackgroundMask({
    data,
    width: info.width,
    height: info.height,
    channels: info.channels,
    threshold,
    neutralThreshold,
    chromaThreshold,
  })

  const backgroundPixels = applyTransparencyMask(data, mask, info.channels)
  const watermarkPixels = removeWatermark
    ? clearBottomRightWatermarkPixels(data, {
        width: info.width,
        height: info.height,
        channels: info.channels,
      })
    : 0

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png()
    .toFile(outputPath)

  return {
    width: info.width,
    height: info.height,
    transparentPixels: backgroundPixels + watermarkPixels,
    backgroundPixels,
    watermarkPixels,
  }
}

export async function removeDioramaBlackBackgrounds({
  inputDir,
  outputDir,
  threshold = DEFAULT_THRESHOLD,
  neutralThreshold = DEFAULT_NEUTRAL_THRESHOLD,
  chromaThreshold = DEFAULT_CHROMA_THRESHOLD,
  removeWatermark = true,
}) {
  await fs.mkdir(outputDir, { recursive: true })

  const entries = await fs.readdir(inputDir, { withFileTypes: true })
  let processed = 0
  let ignored = 0
  let failed = 0

  for (const entry of entries) {
    if (!entry.isFile()) {
      ignored += 1
      continue
    }

    const ext = path.extname(entry.name).toLowerCase()
    if (!SUPPORTED_EXTENSIONS.has(ext)) {
      console.log(`skip ${entry.name} (unsupported extension)`)
      ignored += 1
      continue
    }

    const inputPath = path.join(inputDir, entry.name)
    const outputName = `${path.basename(entry.name, ext)}.png`
    const outputPath = path.join(outputDir, outputName)

    try {
      const result = await processImage({
        inputPath,
        outputPath,
        threshold,
        neutralThreshold,
        chromaThreshold,
        removeWatermark,
      })
      const percent = ((result.transparentPixels / (result.width * result.height)) * 100).toFixed(1)
      console.log(
        `ok ${entry.name} -> ${outputName} (${percent}% transparent, watermark=${result.watermarkPixels})`,
      )
      processed += 1
    } catch (error) {
      console.error(
        `error ${entry.name}: ${error instanceof Error ? error.message : String(error)}`,
      )
      failed += 1
    }
  }

  console.log(
    `Done. processed=${processed}, ignored=${ignored}, failed=${failed}, threshold=${threshold}, neutralThreshold=${neutralThreshold}, chromaThreshold=${chromaThreshold}`,
  )

  if (failed > 0) {
    process.exitCode = 1
  }

  return { processed, ignored, failed }
}

function isDirectRun(metaUrl) {
  return process.argv[1] && fileURLToPath(metaUrl) === path.resolve(process.argv[1])
}

if (isDirectRun(import.meta.url)) {
  try {
    const options = parseCliArgs(process.argv.slice(2))
    await removeDioramaBlackBackgrounds(options)
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
