import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import * as Localization from 'expo-localization';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const locale = Localization.getLocales()[0];

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={styles.glassCard}>
        <Text style={styles.title}>Make the Change</Text>
        <Text style={styles.subtitle}>
          Language: {locale.languageCode} - {locale.regionCode}
        </Text>
        <Text style={styles.description}>
          Expo SDK 55 + NativeWind v4 + Expo Router Tabs
        </Text>
        
        <View style={styles.buttonContainer}>
          <Link href="/profile" style={styles.link}>
            <Text style={styles.buttonText}>Go to Profile</Text>
          </Link>
          
          <Link href="/settings" style={styles.link}>
            <Text style={styles.buttonText}>Go to Settings</Text>
          </Link>
        </View>
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
  glassCard: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
    opacity: 0.8,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  },
  buttonContainer: {
    gap: 15,
  },
  link: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
