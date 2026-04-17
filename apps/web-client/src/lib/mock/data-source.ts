export type AppDataSource = 'mock' | 'supabase'

const resolveAppDataSource = (value: string | undefined): AppDataSource => {
  return value?.trim().toLowerCase() === 'supabase' ? 'supabase' : 'mock'
}

export const APP_DATA_SOURCE = resolveAppDataSource(process.env.NEXT_PUBLIC_MTC_DATA_SOURCE)
export const isMockDataSource = APP_DATA_SOURCE === 'mock'
