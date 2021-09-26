import React, { useMemo } from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ProfileProvider } from './hooks/useProfile'
import { Routers } from './routes'
import { Provider as JotaiProvider } from 'jotai'
import { IntryUrl } from './hooks/useWechat'

IntryUrl.set(location.href.split('#')[0])

const App: React.FC = () => {
  const queryClient = useMemo(() => {
    return new QueryClient()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <ProfileProvider>
          <Routers />
        </ProfileProvider>
      </JotaiProvider>
    </QueryClientProvider>
  )
}

export default App
