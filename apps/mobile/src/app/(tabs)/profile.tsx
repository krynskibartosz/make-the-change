import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native'
import { useAuth } from '@/lib/auth-context'
import { useQuery } from '@tanstack/react-query'
import { fetchUserProfile, fetchUserInvestments } from '@/lib/api'

export default function ProfileScreen() {
  const { user, signOut, loading: authLoading } = useAuth()

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: fetchUserProfile,
    enabled: !!user,
  })

  const { data: investments, isLoading: investmentsLoading } = useQuery({
    queryKey: ['investments', user?.id],
    queryFn: fetchUserInvestments,
    enabled: !!user,
  })

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error: any) {
      console.error('Sign out error:', error)
    }
  }

  if (authLoading || profileLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <Text className="text-xl font-bold mb-4">Non connecté</Text>
        <Text className="text-muted-foreground text-center">
          Veuillez vous connecter pour accéder à votre profil
        </Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <View className="mb-8">
          <Text className="text-3xl font-bold mb-2">Mon Profil</Text>
          <Text className="text-muted-foreground">Gérez votre compte et vos statistiques</Text>
        </View>

        {/* User Info */}
        <View className="bg-card border border-border rounded-2xl p-6 mb-6">
          <Text className="text-sm text-muted-foreground mb-1">Email</Text>
          <Text className="text-lg font-semibold mb-4">{user.email}</Text>

          {profile && (
            <>
              {profile.display_name && (
                <>
                  <Text className="text-sm text-muted-foreground mb-1">Nom d'affichage</Text>
                  <Text className="text-lg font-semibold mb-4">{profile.display_name}</Text>
                </>
              )}

              {profile.bio && (
                <>
                  <Text className="text-sm text-muted-foreground mb-1">Bio</Text>
                  <Text className="text-base">{profile.bio}</Text>
                </>
              )}
            </>
          )}
        </View>

        {/* Stats */}
        <View className="bg-card border border-border rounded-2xl p-6 mb-6">
          <Text className="text-xl font-bold mb-4">Statistiques</Text>

          <View className="flex-row justify-between mb-4">
            <Text className="text-muted-foreground">Investissements</Text>
            <Text className="font-bold">{investmentsLoading ? '...' : investments?.length || 0}</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-muted-foreground">Montant total investi</Text>
            <Text className="font-bold">
              {investmentsLoading
                ? '...'
                : `${(investments || [])
                    .reduce((sum, inv) => sum + Number(inv.amount_eur_equivalent || 0), 0)
                    .toFixed(2)} €`}
            </Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <Pressable
          className="bg-destructive p-4 rounded-xl active:opacity-80"
          onPress={handleSignOut}
        >
          <Text className="text-destructive-foreground text-center font-semibold text-base">
            Déconnexion
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}
