import React, { useEffect, useMemo } from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ProfileProvider } from './hooks/useProfile'
import { Routers } from './routes'
import { IntryUrl } from './hooks/useWechat'

const App: React.FC = () => {
  const queryClient = useMemo(() => {
    return new QueryClient()
  }, [])

  useEffect(() => {
    IntryUrl.set(location.href.split('#')[0])
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
