type ZoneStatusInput = {
  tasksCount: number
  interventionsCount: number
  isSensible?: boolean | null
}

export type ZoneStatus = {
  label: 'Attention requise' | 'En activité' | 'À jour'
  tone: 'danger' | 'warning' | 'success'
  dotClass: string
}

export function getZoneStatus({
  tasksCount,
  interventionsCount,
  isSensible,
}: ZoneStatusInput): ZoneStatus {
  if (isSensible || tasksCount > 2) {
    return {
      label: 'Attention requise',
      tone: 'danger',
      dotClass: 'bg-danger',
    }
  }

  if (tasksCount > 0 || interventionsCount > 0) {
    return {
      label: 'En activité',
      tone: 'warning',
      dotClass: 'bg-warning',
    }
  }

  return {
    label: 'À jour',
    tone: 'success',
    dotClass: 'bg-success',
  }
}
