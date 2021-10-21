import React, { useMemo } from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { Routers } from './routes'
import { Provider as JotaiProvider } from 'jotai'
import { IntryUrl } from './hooks/useWechat'
import { MibaoProvider } from '@mibao-ui/components'
import '@mibao-ui/components/mibao-ui.esm.css'

IntryUrl.set(location.href.split('#')[0])

const App: React.FC = () => {
  const queryClient = useMemo(() => {
    return new QueryClient()
  }, [])

  return (
    <MibaoProvider>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <Routers />
        </JotaiProvider>
      </QueryClientProvider>
    </MibaoProvider>
  )
}

export default App
