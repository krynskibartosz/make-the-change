import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button, TextField } from '@expo/ui'

export function ExpoUIDemo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expo UI Components</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Native TextField</Text>
        <TextField
          placeholder="Entrez votre texte..."
          style={styles.textField}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Native Button</Text>
        <Button
          title="Bouton Natif"
          onPress={() => console.log('Bouton cliqué')}
          style={styles.button}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  textField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  button: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
})
