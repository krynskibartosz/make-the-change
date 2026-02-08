import { ScrollView, Text, View, ActivityIndicator } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/lib/api'

export default function ProductsScreen() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
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
          Impossible de charger les produits
        </Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <View className="mb-6">
          <Text className="text-3xl font-bold mb-2">Boutique</Text>
          <Text className="text-muted-foreground">
            Échangez vos points contre des produits durables
          </Text>
        </View>

        {products && products.length > 0 ? (
          <View className="gap-4">
            {products.map((product: any) => (
              <View
                key={product.id}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <View className="mb-3">
                  <Text className="text-xl font-bold mb-1">{product.name_default}</Text>
                  {product.is_available && (
                    <View className="inline-flex">
                      <Text className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Disponible
                      </Text>
                    </View>
                  )}
                  {!product.is_available && (
                    <View className="inline-flex">
                      <Text className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                        Indisponible
                      </Text>
                    </View>
                  )}
                </View>

                {product.description_default && (
                  <Text className="text-muted-foreground mb-4">
                    {product.description_default}
                  </Text>
                )}

                <View className="border-t border-border pt-4">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-muted-foreground">Prix</Text>
                    <Text className="text-lg font-bold text-primary">
                      {product.price_points ? `${product.price_points} pts` : 'N/A'}
                    </Text>
                  </View>
                  {product.stock_quantity !== null && (
                    <View className="flex-row justify-between mt-2">
                      <Text className="text-sm text-muted-foreground">Stock</Text>
                      <Text className="text-sm font-semibold">
                        {product.stock_quantity} disponible(s)
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="bg-card border border-border rounded-2xl p-8 items-center">
            <Text className="text-muted-foreground text-center">
              Aucun produit disponible pour le moment
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
