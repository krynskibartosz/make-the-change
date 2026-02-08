export const getEnv = (name: string): string | undefined => process.env[name]

export const requireEnv = (name: string): string => {
  const value = getEnv(name)
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}
