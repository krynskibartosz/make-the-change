import { TabScreen } from './_components/tab-screen'

export default function TabsLoading() {
  return (
    <TabScreen title="Chargement">
      <div className="flex flex-col gap-6 p-4">
        <div>Loading...</div>
      </div>
    </TabScreen>
  )
}
