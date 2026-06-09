import { Skeleton } from '@/components/ui'
import { TabScreen } from './_components/tab-screen'

export default function TabsLoading() {
  return (
    <TabScreen title="Chargement">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </TabScreen>
  )
}
