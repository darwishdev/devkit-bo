import { QueryClient } from '@tanstack/vue-query'
import { persistQueryClient, type PersistedClient } from '@tanstack/query-persist-client-core'

const localStoragePersistor = {
  persistClient: async (client: PersistedClient) => {
    localStorage.setItem('tanstack-query-cache', JSON.stringify(client))
  },
  restoreClient: async () => {
    const cache = localStorage.getItem('tanstack-query-cache')
    return undefined
    return cache ? JSON.parse(cache) : undefined
  },
  removeClient: async () => {
    localStorage.removeItem('tanstack-query-cache')
  },
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },

  },
})

persistQueryClient({
  queryClient,
  persister: localStoragePersistor,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => query.state.status === 'success',
  },
})
export default queryClient
