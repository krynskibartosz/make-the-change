import { describe, expect, it } from 'vitest'
import {
  constrainAtlasCamera,
  getAtlasCameraAutoView,
  zoomAtlasCameraAtPoint,
} from './atlas-camera'

describe('atlas camera gestures', () => {
  it('zooms around the gesture point so the map content stays anchored under the fingers', () => {
    const camera = { x: -120, y: -80, scale: 1 }

    const next = zoomAtlasCameraAtPoint(camera, { x: 200, y: 300 }, 2)

    expect(next).toEqual({ x: -440, y: -460, scale: 2 })
  })

  it('clamps zoom to the configured min and max scale', () => {
    const viewport = { width: 390, height: 844 }
    const map = { width: 760, height: 1064 }

    expect(
      constrainAtlasCamera({ x: 0, y: 0, scale: 0.2 }, viewport, map, {
        minScale: 0.75,
        maxScale: 2.6,
      }).scale,
    ).toBe(0.75)
    expect(
      constrainAtlasCamera({ x: 0, y: 0, scale: 4 }, viewport, map, {
        minScale: 0.75,
        maxScale: 2.6,
      }).scale,
    ).toBe(2.6)
  })

  it('keeps at least a useful part of the map inside the viewport while panning', () => {
    const viewport = { width: 390, height: 844 }
    const map = { width: 760, height: 1064 }

    const next = constrainAtlasCamera({ x: -2000, y: 1200, scale: 1 }, viewport, map, {
      minScale: 0.75,
      maxScale: 2.6,
      overscroll: 96,
    })

    expect(next.x > -760).toBe(true)
    expect(next.y < 844).toBe(true)
  })

  it('asks the Atlas to return to world mode when the camera is fully zoomed out', () => {
    const result = getAtlasCameraAutoView(
      { x: -120, y: -80, scale: 0.84 },
      { width: 390, height: 844 },
      { width: 760, height: 1064 },
      { width: 1000, height: 1400 },
      [{ id: 'alphabet', x: 250, y: 360 }],
      { worldScale: 0.9, detailScale: 1.48, detailRadius: 220 },
    )

    expect(result).toEqual({ mode: 'world' })
  })

  it('selects the nearest territory under the viewport center after a strong zoom-in', () => {
    const result = getAtlasCameraAutoView(
      { x: -100, y: -120, scale: 1.7 },
      { width: 390, height: 844 },
      { width: 760, height: 1064 },
      { width: 1000, height: 1400 },
      [
        { id: 'alphabet', x: 228, y: 419 },
        { id: 'milieux', x: 640, y: 294 },
      ],
      { worldScale: 0.9, detailScale: 1.48, detailRadius: 220 },
    )

    expect(result).toEqual({ mode: 'domain', targetId: 'alphabet' })
  })

  it('keeps the current mode inside the hysteresis band between world and detail', () => {
    const result = getAtlasCameraAutoView(
      { x: -120, y: -80, scale: 1.18 },
      { width: 390, height: 844 },
      { width: 760, height: 1064 },
      { width: 1000, height: 1400 },
      [{ id: 'alphabet', x: 250, y: 360 }],
      { worldScale: 0.9, detailScale: 1.48, detailRadius: 220 },
    )

    expect(result).toEqual({ mode: 'unchanged' })
  })

  it('can select the territory under the zoom focal point instead of only the viewport center', () => {
    const result = getAtlasCameraAutoView(
      { x: -335, y: -391, scale: 1.7 },
      { width: 390, height: 844 },
      { width: 760, height: 1064 },
      { width: 1000, height: 1400 },
      [
        { id: 'alphabet', x: 250, y: 406 },
        { id: 'relations', x: 410, y: 630 },
      ],
      {
        worldScale: 0.9,
        detailScale: 1.48,
        detailRadius: 220,
        viewportPoint: { x: 10, y: 135 },
      },
    )

    expect(result).toEqual({ mode: 'domain', targetId: 'alphabet' })
  })
})
