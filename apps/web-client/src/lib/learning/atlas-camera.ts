export type AtlasCameraPoint = {
  x: number
  y: number
}

export type AtlasCameraState = AtlasCameraPoint & {
  scale: number
}

export type AtlasCameraSize = {
  width: number
  height: number
}

export type AtlasCameraConstraints = {
  minScale: number
  maxScale: number
  overscroll?: number
}

export type AtlasCameraAutoViewTarget = AtlasCameraPoint & {
  id: string
}

export type AtlasCameraAutoViewOptions = {
  worldScale: number
  detailScale: number
  detailRadius: number
  viewportPoint?: AtlasCameraPoint
}

export type AtlasCameraAutoViewResult<TId extends string = string> =
  | { mode: 'world' }
  | { mode: 'domain'; targetId: TId }
  | { mode: 'unchanged' }

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function zoomAtlasCameraAtPoint(
  camera: AtlasCameraState,
  viewportPoint: AtlasCameraPoint,
  nextScale: number,
): AtlasCameraState {
  const ratio = nextScale / camera.scale

  return {
    x: viewportPoint.x - (viewportPoint.x - camera.x) * ratio,
    y: viewportPoint.y - (viewportPoint.y - camera.y) * ratio,
    scale: nextScale,
  }
}

export function constrainAtlasCamera(
  camera: AtlasCameraState,
  viewport: AtlasCameraSize,
  map: AtlasCameraSize,
  constraints: AtlasCameraConstraints,
): AtlasCameraState {
  const overscroll = constraints.overscroll ?? 120
  const scale = clamp(camera.scale, constraints.minScale, constraints.maxScale)
  const contentMinX = map.width * 0.18 * scale
  const contentMaxX = map.width * 0.82 * scale
  const contentMinY = map.height * 0.22 * scale
  const contentMaxY = map.height * 0.82 * scale

  const rawMinX = viewport.width - contentMaxX - overscroll
  const rawMaxX = -contentMinX + overscroll
  const rawMinY = viewport.height - contentMaxY - overscroll
  const rawMaxY = -contentMinY + overscroll
  const minX = Math.min(rawMinX, rawMaxX)
  const maxX = Math.max(rawMinX, rawMaxX)
  const minY = Math.min(rawMinY, rawMaxY)
  const maxY = Math.max(rawMinY, rawMaxY)

  return {
    x: clamp(camera.x, minX, maxX),
    y: clamp(camera.y, minY, maxY),
    scale,
  }
}

export function getAtlasCameraAutoView<TId extends string = string>(
  camera: AtlasCameraState,
  viewport: AtlasCameraSize,
  map: AtlasCameraSize,
  artboard: AtlasCameraSize,
  targets: (AtlasCameraAutoViewTarget & { id: TId })[],
  options: AtlasCameraAutoViewOptions,
): AtlasCameraAutoViewResult<TId> {
  if (camera.scale <= options.worldScale) {
    return { mode: 'world' }
  }

  if (camera.scale < options.detailScale || targets.length === 0) {
    return { mode: 'unchanged' }
  }

  const scaleFactorX = map.width / artboard.width
  const scaleFactorY = map.height / artboard.height
  const focalPoint = options.viewportPoint ?? {
    x: viewport.width / 2,
    y: viewport.height / 2,
  }
  const center = {
    x: (focalPoint.x - camera.x) / camera.scale / scaleFactorX,
    y: (focalPoint.y - camera.y) / camera.scale / scaleFactorY,
  }
  let nearest = targets[0]
  let nearestDistance = Number.POSITIVE_INFINITY

  for (const target of targets) {
    const distance = Math.hypot(target.x - center.x, target.y - center.y)

    if (distance < nearestDistance) {
      nearest = target
      nearestDistance = distance
    }
  }

  if (nearest && nearestDistance <= options.detailRadius) {
    return { mode: 'domain', targetId: nearest.id }
  }

  return { mode: 'unchanged' }
}
