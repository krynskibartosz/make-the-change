import type { InterventionListItem } from '@/lib/domain'

export type WorkerHistoryStatus = 'sent' | 'pending' | 'validated' | 'correction'

export type WorkerHistoryItem = Readonly<{
  id: string
  title: string
  date: string
  zoneName: string
  status: WorkerHistoryStatus
}>

export type WorkerHistoryGroup = Readonly<{
  label: "Aujourd'hui" | 'Cette semaine'
  items: WorkerHistoryItem[]
}>

export const workerHistoryStatusLabels: Record<WorkerHistoryStatus, string> = {
  sent: 'Envoyé',
  pending: 'En attente',
  validated: 'Validé',
  correction: 'À corriger',
}

function toUtcDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`)
}

function getMonday(date: string) {
  const monday = toUtcDate(date)
  const day = monday.getUTCDay()
  monday.setUTCDate(monday.getUTCDate() - (day === 0 ? 6 : day - 1))
  return monday.toISOString().slice(0, 10)
}

function getWorkerStatus(item: InterventionListItem): WorkerHistoryStatus {
  if (item.status === 'blocked' || item.status === 'cancelled') return 'correction'
  if (item.verificationStatus === 'complete') return 'validated'
  if (item.status === 'done' || item.status === 'draft') return 'sent'
  return 'pending'
}

export function buildWorkerHistoryGroups(
  interventions: InterventionListItem[],
  todayDate: string,
): WorkerHistoryGroup[] {
  const monday = getMonday(todayDate)
  const sortedItems = [...interventions].sort((a, b) => {
    const byDate = b.date.localeCompare(a.date)
    return byDate === 0 ? b.updatedAt.localeCompare(a.updatedAt) : byDate
  })
  const toWorkerItem = (item: InterventionListItem): WorkerHistoryItem => ({
    id: item.id,
    title: item.title,
    date: item.date,
    zoneName: item.zoneName,
    status: getWorkerStatus(item),
  })
  const todayItems = sortedItems.filter((item) => item.date === todayDate).map(toWorkerItem)
  const weekItems = sortedItems
    .filter((item) => item.date >= monday && item.date < todayDate)
    .map(toWorkerItem)

  return [
    { label: "Aujourd'hui", items: todayItems },
    { label: 'Cette semaine', items: weekItems },
  ].filter((group) => group.items.length > 0) as WorkerHistoryGroup[]
}
