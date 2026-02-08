import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import './global.css';

export default function App() {
  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="items-center justify-center flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-8">
          Expo SDK 55 + NativeWind v4
        </Text>
        
        <View className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
          <Text className="text-lg font-semibold mb-4">Nouveaux Composants UI</Text>
          
          <TextInput 
            placeholder="Entrez votre texte..."
            className="mb-4 p-3 border border-gray-300 rounded"
            style={styles.input}
          />
          
          <TouchableOpacity 
            className="bg-blue-500 p-3 rounded-lg"
            style={styles.button}
            onPress={() => console.log('Button pressed!')}
          >
            <Text className="text-white text-center font-semibold">Bouton Expo UI</Text>
          </TouchableOpacity>
        </View>
        
        <Text className="text-sm text-gray-600 mt-8 text-center">
          Jetpack Compose + Swift UI + React Native
        </Text>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
  },
});
