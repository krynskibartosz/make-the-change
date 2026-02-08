import { updateWidgetSnapshot, updateWidgetTimeline } from 'expo-widgets'
import { ProjectWidget, ProjectWidgetProps } from '../widgets/ProjectWidget'

// Widget configuration for app.json
export const widgetConfig = {
  widgets: [
    {
      name: 'ProjectWidget',
      className: 'ProjectWidget',
    },
  ],
}

// Update project widget with real-time data
export async function updateProjectWidget(projectData: ProjectWidgetProps) {
  try {
    await updateWidgetSnapshot('ProjectWidget', ProjectWidget, projectData)
    console.log('Project widget updated successfully')
  } catch (error) {
    console.error('Failed to update project widget:', error)
  }
}

// Schedule project widget updates throughout the day
export async function scheduleProjectWidgetUpdates(projectData: ProjectWidgetProps) {
  try {
    // Schedule updates every 2 hours for the next 24 hours
    const dates = []
    const now = new Date()
    
    for (let i = 0; i < 12; i++) {
      dates.push(new Date(now.getTime() + (i * 2 * 60 * 60 * 1000)))
    }
    
    await updateWidgetTimeline('ProjectWidget', dates, ProjectWidget)
    console.log('Project widget timeline scheduled successfully')
  } catch (error) {
    console.error('Failed to schedule project widget updates:', error)
  }
}

// Live Activity for project funding
export async function startProjectFundingLiveActivity(
  projectName: string,
  currentFunding: number,
  targetFunding: number
) {
  try {
    // This would start a Live Activity for active project funding
    // Implementation depends on your Live Activity setup
    console.log('Starting Live Activity for project:', projectName)
  } catch (error) {
    console.error('Failed to start Live Activity:', error)
  }
}
