import React, { useMemo } from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { Routers } from './routes'
import { Provider as JotaiProvider } from 'jotai'
import { IntryUrl } from './hooks/useWechat'
import { MibaoProvider } from '@mibao-ui/components'
import '@mibao-ui/components/mibao-ui.esm.css'
import { extendTheme } from '@chakra-ui/react'

IntryUrl.set(location.href.split('#')[0])

const mibaoTheme = extendTheme({
  colors: {
    primary: {
      100: '#f5f6fc',
      500: '#5065e5',
      600: '#4050b6',
      700: '#2a3579',
    },
    black: '#23262F',
    gray: {
      200: '#eee',
      800: '#23262F',
      main: '#777E91',
    },
    progress: {
      main: '#5065E5',
    },
    banned: {
      main: '#d03a3a',
    },
  },
  shadows: {
    outline: 'none',
  },
})

const App: React.FC = () => {
  const queryClient = useMemo(() => {
    return new QueryClient()
  }, [])

  return (
    <MibaoProvider theme={mibaoTheme}>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <Routers />
        </JotaiProvider>
      </QueryClientProvider>
    </MibaoProvider>
  )
}

export default App
