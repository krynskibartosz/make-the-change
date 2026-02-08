import { useState } from 'react'
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native'
import { useRouter, Link } from 'expo-router'
import { useAuth } from '@/lib/auth-context'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs')
      return
    }

    setLoading(true)
    try {
      await signIn(email, password)
      router.replace('/(tabs)')
    } catch (error: any) {
      Alert.alert('Erreur de connexion', error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 p-6 justify-center min-h-screen">
        <View className="mb-8">
          <Text className="text-4xl font-bold mb-2">Connexion</Text>
          <Text className="text-muted-foreground">
            Connectez-vous pour accéder à votre compte
          </Text>
        </View>

        <View className="gap-4 mb-6">
          <View>
            <Text className="text-sm font-medium mb-2">Email</Text>
            <TextInput
              className="bg-card border border-border rounded-xl p-4 text-foreground"
              placeholder="votre@email.com"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View>
            <Text className="text-sm font-medium mb-2">Mot de passe</Text>
            <TextInput
              className="bg-card border border-border rounded-xl p-4 text-foreground"
              placeholder="••••••••"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>
        </View>

        <Pressable
          className="bg-primary p-4 rounded-xl mb-4 active:opacity-80"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-primary-foreground text-center font-semibold text-base">
            {loading ? 'Connexion...' : 'Se connecter'}
          </Text>
        </Pressable>

        <View className="flex-row justify-center gap-1">
          <Text className="text-muted-foreground">Pas de compte ?</Text>
          <Link href="/(auth)/register" asChild>
            <Pressable disabled={loading}>
              <Text className="text-primary font-semibold">S'inscrire</Text>
            </Pressable>
          </Link>
        </View>

        <View className="mt-4 flex-row justify-center">
          <Link href="/(auth)/forgot-password" asChild>
            <Pressable disabled={loading}>
              <Text className="text-muted-foreground text-sm">Mot de passe oublié ?</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScrollView>
  )
}
