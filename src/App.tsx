import React, { useMemo } from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ProfileProvider } from './hooks/useProfile'
import { Routers } from './routes'

const App: React.FC = () => {
  const queryClient = useMemo(() => {
    return new QueryClient()
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileProvider>
        <Routers />
      </ProfileProvider>
    </QueryClientProvider>
  )
}

export default App
