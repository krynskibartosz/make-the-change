import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { GlassView } from 'expo-glass-effect'

interface GlassCardProps {
  children: React.ReactNode
  title?: string
  style?: any
}

export function GlassCard({ children, title, style }: GlassCardProps) {
  return (
    <GlassView style={[styles.glassCard, style]}>
      {title && (
        <Text style={styles.title}>{title}</Text>
      )}
      <View style={styles.content}>
        {children}
      </View>
    </GlassView>
  )
}

const styles = StyleSheet.create({
  glassCard: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    minHeight: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
})
