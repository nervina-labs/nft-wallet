import React, { useMemo } from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { Routers } from './routes'

const App: React.FC = () => {
  const queryClient = useMemo(() => {
    return new QueryClient()
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <Routers />
    </QueryClientProvider>
  )
}

export default App
