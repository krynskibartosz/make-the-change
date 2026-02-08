export const db = new Proxy(
  {},
  {
    get() {
      throw new Error(
        '❌ CRITICAL ARCHITECTURE VIOLATION: You are trying to import the DB client on the client-side or mobile. This is strictly forbidden. Use the API.',
      )
    },
  },
)
