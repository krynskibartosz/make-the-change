import { useState } from 'react'
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native'
import { useRouter, Link } from 'expo-router'
import { useAuth } from '@/lib/auth-context'

export default function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password)
      Alert.alert(
        'Inscription réussie',
        'Veuillez vérifier votre email pour confirmer votre compte',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      )
    } catch (error: any) {
      Alert.alert('Erreur d\'inscription', error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 p-6 justify-center min-h-screen">
        <View className="mb-8">
          <Text className="text-4xl font-bold mb-2">Inscription</Text>
          <Text className="text-muted-foreground">Créez votre compte pour commencer</Text>
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

          <View>
            <Text className="text-sm font-medium mb-2">Confirmer le mot de passe</Text>
            <TextInput
              className="bg-card border border-border rounded-xl p-4 text-foreground"
              placeholder="••••••••"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>
        </View>

        <Pressable
          className="bg-primary p-4 rounded-xl mb-4 active:opacity-80"
          onPress={handleRegister}
          disabled={loading}
        >
          <Text className="text-primary-foreground text-center font-semibold text-base">
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </Text>
        </Pressable>

        <View className="flex-row justify-center gap-1">
          <Text className="text-muted-foreground">Déjà un compte ?</Text>
          <Link href="/(auth)/login" asChild>
            <Pressable disabled={loading}>
              <Text className="text-primary font-semibold">Se connecter</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScrollView>
  )
}
