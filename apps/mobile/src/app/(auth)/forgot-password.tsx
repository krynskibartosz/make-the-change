import { useState } from 'react'
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native'
import { useRouter, Link } from 'expo-router'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez entrer votre email')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'makethechange://reset-password',
      })

      if (error) throw error

      Alert.alert(
        'Email envoyé',
        'Veuillez vérifier votre boîte de réception pour réinitialiser votre mot de passe',
        [{ text: 'OK', onPress: () => router.back() }]
      )
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 p-6 justify-center min-h-screen">
        <View className="mb-8">
          <Text className="text-4xl font-bold mb-2">Mot de passe oublié</Text>
          <Text className="text-muted-foreground">
            Entrez votre email pour recevoir un lien de réinitialisation
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
        </View>

        <Pressable
          className="bg-primary p-4 rounded-xl mb-4 active:opacity-80"
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text className="text-primary-foreground text-center font-semibold text-base">
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </Text>
        </Pressable>

        <View className="flex-row justify-center gap-1">
          <Link href="/(auth)/login" asChild>
            <Pressable disabled={loading}>
              <Text className="text-muted-foreground">Retour à la connexion</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScrollView>
  )
}
