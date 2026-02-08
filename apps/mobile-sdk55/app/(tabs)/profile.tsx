import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#f093fb', '#f5576c']}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Profile Screen</Text>
        <Text style={styles.description}>
          This is the profile page with Expo Router navigation.
        </Text>
        <Text style={styles.info}>
          ✅ Expo SDK 55 Beta Working
          ✅ NativeWind v4 Compatible  
          ✅ Tabs Navigation Active
        </Text>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  info: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#f5576c',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
