import { SplitView } from 'expo-router/unstable-split-view'
import { Slot } from 'expo-router'

export default function TabletLayout() {
  return (
    <SplitView>
      {/* Sidebar with project list */}
      <SplitView.Column>
        <Slot />
      </SplitView.Column>
      
      {/* Main content area */}
      <Slot />
      
      {/* Inspector panel for project details */}
      <SplitView.Inspector>
        <Slot />
      </SplitView.Inspector>
    </SplitView>
  )
}
