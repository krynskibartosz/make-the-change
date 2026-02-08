import * as StoreReview from 'expo-storereview'
import { Platform } from 'react-native'

export class StoreReviewService {
  // Check if store review is available
  static async isAvailable(): Promise<boolean> {
    try {
      return await StoreReview.isAvailableAsync()
    } catch (error) {
      console.error('Error checking store review availability:', error)
      return false
    }
  }

  // Request a store review
  static async requestReview(): Promise<boolean> {
    try {
      const isAvailable = await this.isAvailable()
      if (!isAvailable) {
        console.log('Store review is not available on this device')
        return false
      }

      await StoreReview.requestReview()
      console.log('Store review requested successfully')
      return true
    } catch (error) {
      console.error('Error requesting store review:', error)
      return false
    }
  }

  // Get store URL for direct navigation
  static getStoreUrl(): string | null {
    try {
      return StoreReview.storeUrl()
    } catch (error) {
      console.error('Error getting store URL:', error)
      return null
    }
  }

  // Check if the device can perform a review action
  static async hasReviewAction(): Promise<boolean> {
    try {
      return await StoreReview.hasAction()
    } catch (error) {
      console.error('Error checking review action availability:', error)
      return false
    }
  }

  // Smart review request with conditions
  static async requestReviewIfConditionsMet(
    userPoints: number,
    projectsInvested: number,
    daysSinceFirstUse: number
  ): Promise<boolean> {
    // Only request if user meets certain criteria
    if (userPoints < 100 || projectsInvested < 1 || daysSinceFirstUse < 7) {
      console.log('User does not meet criteria for store review request')
      return false
    }

    // Check if review is available
    const isAvailable = await this.isAvailable()
    if (!isAvailable) {
      console.log('Store review not available')
      return false
    }

    // Request the review
    return await this.requestReview()
  }

  // Platform-specific review handling
  static async requestReviewWithPlatformHandling(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        // iOS specific handling
        const hasAction = await this.hasReviewAction()
        if (!hasAction) {
          console.log('iOS device cannot perform review action')
          return false
        }
      }

      return await this.requestReview()
    } catch (error) {
      console.error('Error in platform-specific review request:', error)
      return false
    }
  }
}

// React hook for store review functionality
import { useState, useEffect } from 'react'

export function useStoreReview() {
  const [isAvailable, setIsAvailable] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const available = await StoreReviewService.isAvailable()
        setIsAvailable(available)
      } catch (error) {
        console.error('Error checking store review availability:', error)
        setIsAvailable(false)
      }
    }

    checkAvailability()
  }, [])

  const requestReview = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const success = await StoreReviewService.requestReview()
      return success
    } catch (error) {
      console.error('Error requesting review:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const requestReviewIfConditionsMet = async (
    userPoints: number,
    projectsInvested: number,
    daysSinceFirstUse: number
  ): Promise<boolean> => {
    setIsLoading(true)
    try {
      const success = await StoreReviewService.requestReviewIfConditionsMet(
        userPoints,
        projectsInvested,
        daysSinceFirstUse
      )
      return success
    } catch (error) {
      console.error('Error requesting review with conditions:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getStoreUrl = (): string | null => {
    return StoreReviewService.getStoreUrl()
  }

  return {
    isAvailable,
    isLoading,
    requestReview,
    requestReviewIfConditionsMet,
    getStoreUrl,
  }
}
