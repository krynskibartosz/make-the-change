import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

// SwiftUI Components (iOS)
export function SwiftUIButton({ 
  title, 
  onPress, 
  variant = 'primary' 
}: { 
  title: string; 
  onPress: () => void; 
  variant?: 'primary' | 'secondary' 
}) {
  // This would use @expo/ui/swift-ui in a real implementation
  return (
    <View style={[styles.button, variant === 'secondary' && styles.buttonSecondary]}>
      <Text style={styles.buttonText}>{title}</Text>
    </View>
  )
}

export function SwiftUIInput({ 
  placeholder, 
  value, 
  onChangeText 
}: { 
  placeholder: string; 
  value: string; 
  onChangeText: (text: string) => void 
}) {
  // This would use @expo/ui/swift-ui in a real implementation
  return (
    <View style={styles.input}>
      <Text style={styles.inputText}>{value || placeholder}</Text>
    </View>
  )
}

// Jetpack Compose Components (Android)
export function ComposeCard({ 
  title, 
  subtitle, 
  children 
}: { 
  title: string; 
  subtitle?: string; 
  children?: React.ReactNode 
}) {
  // This would use @expo/ui/jetpack-compose in a real implementation
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
      {children}
    </View>
  )
}

export function ComposeListItem({ 
  title, 
  subtitle, 
  onPress 
}: { 
  title: string; 
  subtitle?: string; 
  onPress: () => void 
}) {
  // This would use @expo/ui/jetpack-compose in a real implementation
  return (
    <View style={styles.listItem} onTouchEnd={onPress}>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.listItemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  )
}

// Cross-platform native components
export function NativeSwitch({ 
  value, 
  onValueChange 
}: { 
  value: boolean; 
  onValueChange: (value: boolean) => void 
}) {
  // This would use platform-specific native switches
  return (
    <View style={styles.switch} onTouchEnd={() => onValueChange(!value)}>
      <Text style={styles.switchText}>{value ? 'ON' : 'OFF'}</Text>
    </View>
  )
}

export function NativeSlider({ 
  value, 
  minimumValue, 
  maximumValue, 
  onValueChange 
}: { 
  value: number; 
  minimumValue: number; 
  maximumValue: number; 
  onValueChange: (value: number) => void 
}) {
  // This would use platform-specific native sliders
  return (
    <View style={styles.slider}>
      <Text style={styles.sliderText}>
        {Math.round((value / maximumValue) * 100)}%
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#e5e7eb',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  inputText: {
    color: '#000000',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  listItem: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  switch: {
    width: 50,
    height: 30,
    backgroundColor: '#059669',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  slider: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sliderText: {
    textAlign: 'center',
    color: '#000000',
    fontWeight: '600',
  },
})
