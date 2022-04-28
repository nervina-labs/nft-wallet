import React, { useMemo } from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { Routers } from './routes'
import { Provider as JotaiProvider } from 'jotai'
import { IntryUrl } from './hooks/useWechat'
import { I18nextProvider } from 'react-i18next'
import '@mibao-ui/components/mibao-ui.esm.css'
import 'swiper/swiper.min.css'
import 'swiper/modules/autoplay/autoplay.min.css'
import 'swiper/modules/pagination/pagination.min.css'
import i18n from './i18n'

IntryUrl.set(location.href.split('#')[0])
const App: React.FC = () => {
  const qc = useMemo(() => {
    return new QueryClient()
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={qc}>
        <JotaiProvider>
          <Routers />
        </JotaiProvider>
      </QueryClientProvider>
    </I18nextProvider>
  )
}

export default App
