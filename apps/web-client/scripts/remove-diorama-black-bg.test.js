import { describe, expect, it } from 'vitest'

import {
  clearBottomRightWatermarkPixels,
  createEdgeConnectedBackgroundMask,
  isAlmostBlack,
  isLowChromaDark,
} from './remove-diorama-black-bg.mjs'

function createRgbaImage(width, height, fill = [255, 255, 255, 255]) {
  const data = new Uint8Array(width * height * 4)

  for (let i = 0; i < data.length; i += 4) {
    data[i] = fill[0]
    data[i + 1] = fill[1]
    data[i + 2] = fill[2]
    data[i + 3] = fill[3]
  }

  return data
}

function setPixel(data, width, x, y, rgba) {
  const index = (y * width + x) * 4
  data[index] = rgba[0]
  data[index + 1] = rgba[1]
  data[index + 2] = rgba[2]
  data[index + 3] = rgba[3]
}

describe('remove diorama black background masking', () => {
  it('detects near-black pixels using an inclusive threshold', () => {
    expect(isAlmostBlack(32, 20, 12, 32)).toBe(true)
    expect(isAlmostBlack(33, 20, 12, 32)).toBe(false)
  })

  it('treats neutral dark pixels as background without matching saturated browns', () => {
    expect(isLowChromaDark(99, 108, 105, 112, 28)).toBe(true)
    expect(isLowChromaDark(106, 80, 55, 112, 28)).toBe(false)
  })

  it('marks only dark pixels connected to image edges as background', () => {
    const width = 5
    const height = 5
    const data = createRgbaImage(width, height)

    for (let x = 0; x < width; x += 1) {
      setPixel(data, width, x, 0, [4, 4, 4, 255])
    }

    setPixel(data, width, 2, 2, [0, 0, 0, 255])

    const mask = createEdgeConnectedBackgroundMask({
      data,
      width,
      height,
      channels: 4,
      threshold: 32,
    })

    expect(mask[0]).toBe(1)
    expect(mask[2]).toBe(1)
    expect(mask[2 * width + 2]).toBe(0)
  })

  it('clears neutral bright watermark pixels only in the bottom-right zone', () => {
    const width = 10
    const height = 10
    const data = createRgbaImage(width, height, [0, 0, 0, 0])

    setPixel(data, width, 8, 8, [180, 182, 181, 255])
    setPixel(data, width, 2, 2, [180, 182, 181, 255])
    setPixel(data, width, 8, 7, [170, 90, 40, 255])

    const cleared = clearBottomRightWatermarkPixels(data, {
      width,
      height,
      channels: 4,
      zoneWidthRatio: 0.3,
      zoneHeightRatio: 0.3,
      minBrightness: 96,
      chromaThreshold: 16,
    })

    expect(cleared).toBe(1)
    expect(data[(8 * width + 8) * 4 + 3]).toBe(0)
    expect(data[(2 * width + 2) * 4 + 3]).toBe(255)
    expect(data[(7 * width + 8) * 4 + 3]).toBe(255)
  })
})
