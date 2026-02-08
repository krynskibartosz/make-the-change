import { useState } from 'react'
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react-native'

export default function ContactProducerScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs')
      return
    }

    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour envoyer un message')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from('producer_messages').insert({
        producer_id: id,
        sender_user_id: user.id,
        subject: subject.trim(),
        message: message.trim(),
      })

      if (error) throw error

      Alert.alert('Succès', 'Votre message a été envoyé au producteur !', [
        { text: 'OK', onPress: () => router.back() },
      ])

      // Reset form
      setSubject('')
      setMessage('')
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <Text className="text-xl font-bold mb-4">Connexion requise</Text>
        <Text className="text-muted-foreground text-center mb-6">
          Vous devez être connecté pour contacter un producteur
        </Text>
        <Pressable
          className="bg-primary px-6 py-3 rounded-xl"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-primary-foreground font-semibold">Se connecter</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <Pressable
          className="flex-row items-center gap-2 mb-6"
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#666" />
          <Text className="text-muted-foreground">Retour</Text>
        </Pressable>

        <View className="mb-8">
          <Text className="text-3xl font-bold mb-2">Contacter {name}</Text>
          <Text className="text-muted-foreground">
            Envoyez un message au producteur. Votre demande sera traitée rapidement.
          </Text>
        </View>

        <View className="gap-6">
          <View>
            <Text className="text-sm font-medium mb-2">Sujet</Text>
            <TextInput
              className="bg-card border border-border rounded-xl p-4 text-foreground"
              placeholder="Objet de votre message"
              placeholderTextColor="#888"
              value={subject}
              onChangeText={setSubject}
              maxLength={200}
              editable={!loading}
            />
            <Text className="text-xs text-muted-foreground mt-1">
              {subject.length}/200 caractères
            </Text>
          </View>

          <View>
            <Text className="text-sm font-medium mb-2">Message</Text>
            <TextInput
              className="bg-card border border-border rounded-xl p-4 text-foreground min-h-[200px]"
              placeholder={`Votre message à ${name}...`}
              placeholderTextColor="#888"
              value={message}
              onChangeText={setMessage}
              maxLength={2000}
              multiline
              textAlignVertical="top"
              editable={!loading}
            />
            <Text className="text-xs text-muted-foreground mt-1">
              {message.length}/2000 caractères
            </Text>
          </View>

          <Pressable
            className="bg-primary p-4 rounded-xl active:opacity-80"
            onPress={handleSubmit}
            disabled={loading || !subject.trim() || !message.trim()}
          >
            <Text className="text-primary-foreground text-center font-semibold text-base">
              {loading ? 'Envoi en cours...' : 'Envoyer le message'}
            </Text>
          </Pressable>

          <Text className="text-sm text-muted-foreground text-center">
            Votre email et votre nom seront transmis au producteur pour qu'il puisse vous répondre.
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}
