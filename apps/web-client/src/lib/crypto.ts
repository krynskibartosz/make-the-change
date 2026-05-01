/**
 * Cryptographically secure replacement for Math.random() usage
 */

/**
 * Generates a secure random integer between min (inclusive) and max (exclusive).
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (exclusive)
 * @returns A cryptographically secure random integer
 */
export function getRandomInt(min: number, max: number): number {
  if (min >= max) {
    throw new Error('min must be less than max')
  }

  const range = max - min
  const bytesNeeded = Math.ceil(Math.log2(range) / 8)
  const maxValue = Math.pow(256, bytesNeeded)
  const byteArray = new Uint8Array(bytesNeeded)

  let randomValue: number
  do {
    crypto.getRandomValues(byteArray)
    randomValue = 0
    for (let i = 0; i < bytesNeeded; i++) {
      randomValue = (randomValue * 256) + byteArray[i]!
    }
    // Handle modulo bias
  } while (randomValue >= maxValue - (maxValue % range))

  return min + (randomValue % range)
}

/**
 * Shuffles an array using the Fisher-Yates algorithm with cryptographically secure randomness.
 * @param array - The array to shuffle
 * @returns A new shuffled array
 */
export function secureShuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
  }
  return shuffled
}
