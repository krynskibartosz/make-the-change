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

export type AtlasCameraAutoViewResult =
  | { mode: 'world' }
  | { mode: 'domain'; targetId: string }
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
  const scaledWidth = map.width * scale
  const scaledHeight = map.height * scale
  const minX = Math.min(viewport.width - scaledWidth + overscroll, overscroll)
  const maxX = Math.max(viewport.width - overscroll, viewport.width - scaledWidth - overscroll)
  const minY = Math.min(viewport.height - scaledHeight + overscroll, overscroll)
  const maxY = Math.max(viewport.height - overscroll, viewport.height - scaledHeight - overscroll)

  return {
    x: clamp(camera.x, minX, maxX),
    y: clamp(camera.y, minY, maxY),
    scale,
  }
}

export function getAtlasCameraAutoView(
  camera: AtlasCameraState,
  viewport: AtlasCameraSize,
  map: AtlasCameraSize,
  artboard: AtlasCameraSize,
  targets: AtlasCameraAutoViewTarget[],
  options: AtlasCameraAutoViewOptions,
): AtlasCameraAutoViewResult {
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
