import { ScrollView, Text, View, ActivityIndicator } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { fetchProjects } from '@/lib/api'

export default function ProjectsScreen() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <Text className="text-xl font-bold mb-2">Erreur</Text>
        <Text className="text-muted-foreground text-center">
          Impossible de charger les projets
        </Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <View className="mb-6">
          <Text className="text-3xl font-bold mb-2">Projets</Text>
          <Text className="text-muted-foreground">
            Découvrez nos projets de biodiversité
          </Text>
        </View>

        {projects && projects.length > 0 ? (
          <View className="gap-4">
            {projects.map((project: any) => (
              <View
                key={project.id}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <View className="mb-3">
                  <Text className="text-xl font-bold mb-1">{project.name_default}</Text>
                  {project.status && (
                    <View className="inline-flex">
                      <Text
                        className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {project.status}
                      </Text>
                    </View>
                  )}
                </View>

                {project.description_default && (
                  <Text className="text-muted-foreground mb-4">
                    {project.description_default}
                  </Text>
                )}

                {(project.target_budget || project.current_funding) && (
                  <View className="border-t border-border pt-4">
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted-foreground">Objectif</Text>
                      <Text className="text-sm font-semibold">
                        {project.target_budget ? `${project.target_budget} €` : 'N/A'}
                      </Text>
                    </View>
                    <View className="flex-row justify-between mt-2">
                      <Text className="text-sm text-muted-foreground">Financé</Text>
                      <Text className="text-sm font-semibold">
                        {project.current_funding ? `${project.current_funding} €` : '0 €'}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View className="bg-card border border-border rounded-2xl p-8 items-center">
            <Text className="text-muted-foreground text-center">
              Aucun projet disponible pour le moment
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
