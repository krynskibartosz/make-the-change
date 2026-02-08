import { useQuery } from '@tanstack/react-query'
import { ScrollView, Text, View, ImageBackground } from 'react-native'
import { fetchFeaturedProjects } from '@/lib/api'

export default function HomeScreen() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['featured-projects'],
    queryFn: fetchFeaturedProjects,
  })

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop' }}
      style={{ flex: 1 }}
      imageStyle={{ opacity: 0.1 }}
    >
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-3xl font-bold mb-2">Investissez dans la biodiversité</Text>
          <Text className="text-muted-foreground mb-8">
            Découvrez nos projets et produits durables
          </Text>

          <View className="gap-4 mb-8">
            <View className="bg-card/80 p-6 rounded-xl border border-border backdrop-blur-sm">
              <Text className="text-2xl mb-2">🌱 Projets</Text>
              <Text className="text-muted-foreground">
                Investissez dans des projets de biodiversité
              </Text>
            </View>

            <View className="bg-card/80 p-6 rounded-xl border border-border backdrop-blur-sm">
              <Text className="text-2xl mb-2">🛍️ Boutique</Text>
              <Text className="text-muted-foreground">Échangez vos points contre des produits</Text>
            </View>
          </View>

          {!isLoading && projects && projects.length > 0 && (
            <View>
              <Text className="text-2xl font-bold mb-4">Projets en vedette</Text>
              <View className="gap-4">
                {projects.map((project) => (
                  <View key={project.id} className="bg-card/80 p-6 rounded-xl border border-border backdrop-blur-sm">
                    <Text className="text-xl font-semibold mb-2">{project.slug}</Text>
                    <Text className="text-muted-foreground">{project.description_default}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  )
}
