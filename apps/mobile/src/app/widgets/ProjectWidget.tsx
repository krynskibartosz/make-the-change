import { Text, VStack, HStack } from '@expo/ui/swift-ui'
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers'
import { WidgetBase } from 'expo-widgets'

export interface ProjectWidgetProps {
  projectName: string
  currentFunding: number
  targetFunding: number
  progress: number
}

export const ProjectWidget = (props: WidgetBase<ProjectWidgetProps>) => {
  const progressPercentage = Math.round((props.currentFunding / props.targetFunding) * 100)
  
  // Responsive layout based on widget size
  if (props.family === 'systemSmall') {
    return (
      <VStack>
        <Text 
          modifiers={[
            font({ weight: 'bold', size: 14 }), 
            foregroundStyle('#059669')
          ]}
        >
          🌱 {props.projectName}
        </Text>
        <Text 
          modifiers={[
            font({ weight: 'semibold', size: 16 }), 
            foregroundStyle('#000000')
          ]}
        >
          {progressPercentage}%
        </Text>
        <Text 
          modifiers={[
            font({ size: 12 }), 
            foregroundStyle('#666666')
          ]}
        >
          {props.currentFunding}€ / {props.targetFunding}€
        </Text>
      </VStack>
    )
  }

  if (props.family === 'systemMedium') {
    return (
      <VStack>
        <HStack>
          <Text 
            modifiers={[
              font({ weight: 'bold', size: 16 }), 
              foregroundStyle('#059669')
            ]}
          >
            🌱 {props.projectName}
          </Text>
          <Text 
            modifiers={[
              font({ weight: 'bold', size: 16 }), 
              foregroundStyle('#000000')
            ]}
          >
            {progressPercentage}%
          </Text>
        </HStack>
        <Text 
          modifiers={[
            font({ size: 14 }), 
            foregroundStyle('#666666')
          ]}
        >
          Financement: {props.currentFunding}€ / {props.targetFunding}€
        </Text>
        <Text 
          modifiers={[
            font({ size: 12 }), 
            foregroundStyle('#999999')
          ]}
        >
          Mis à jour: {props.date.toLocaleTimeString()}
        </Text>
      </VStack>
    )
  }

  // systemLarge and extraLarge
  return (
    <VStack>
      <Text 
        modifiers={[
          font({ weight: 'bold', size: 18 }), 
          foregroundStyle('#059669')
        ]}
      >
        🌱 {props.projectName}
      </Text>
      
      <HStack>
        <VStack>
          <Text 
            modifiers={[
              font({ weight: 'bold', size: 20 }), 
              foregroundStyle('#000000')
            ]}
          >
            {progressPercentage}%
          </Text>
          <Text 
            modifiers={[
              font({ size: 12 }), 
              foregroundStyle('#666666')
            ]}
          >
            complété
          </Text>
        </VStack>
        
        <VStack>
          <Text 
            modifiers={[
              font({ weight: 'semibold', size: 16 }), 
              foregroundStyle('#059669')
            ]}
          >
            {props.currentFunding}€
          </Text>
          <Text 
            modifiers={[
              font({ size: 12 }), 
              foregroundStyle('#666666')
            ]}
          >
            actuel
          </Text>
        </VStack>
        
        <VStack>
          <Text 
            modifiers={[
              font({ weight: 'semibold', size: 16 }), 
              foregroundStyle('#999999')
            ]}
          >
            {props.targetFunding}€
          </Text>
          <Text 
            modifiers={[
              font({ size: 12 }), 
              foregroundStyle('#666666')
            ]}
          >
            objectif
          </Text>
        </VStack>
      </HStack>
      
      <Text 
        modifiers={[
          font({ size: 12 }), 
          foregroundStyle('#999999')
        ]}
      >
        Mis à jour: {props.date.toLocaleString()}
      </Text>
    </VStack>
  )
}
