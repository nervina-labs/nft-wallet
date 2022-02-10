import { Appbar, AppbarSticky } from '../../components/Appbar'
import { Tabs, Tab, TabList } from '@mibao-ui/components'
import { MainContainer } from '../../styles'
import { Sent } from './components/sent'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Received } from './components/received'
import { useRouteQuerySearch } from '../../hooks/useRouteQuery'
import { Redirect } from 'react-router-dom'
import { RoutePath } from '../../routes'
import { useAccountStatus } from '../../hooks/useAccount'

const TAB_ROUTE_QUERY_SET = ['sent', 'received'] as const

export const RedEnvelopeRecord: React.FC = () => {
  const { t } = useTranslation('translations')
  const [tabType, setTabType] = useRouteQuerySearch<
    typeof TAB_ROUTE_QUERY_SET[number]
  >('type', 'sent')
  const tabIndex = useMemo(() => {
    const v = TAB_ROUTE_QUERY_SET.indexOf(tabType)
    return v === -1 ? 0 : v
  }, [tabType])
  const { isLogined } = useAccountStatus()

  if (!isLogined) {
    return <Redirect to={RoutePath.Login} />
  }

  return (
    <MainContainer bg="linear-gradient(180deg, #F7F7F7 0%, #FFFFFF 100%)">
      <AppbarSticky>
        <Appbar title={t('red-envelope-records.title')} />
        <Tabs
          colorScheme="black"
          bg="white"
          onChange={(i) => setTabType(TAB_ROUTE_QUERY_SET[i])}
          index={tabIndex}
        >
          <TabList justifyContent="center">
            <Tab mr="24px">{t('red-envelope-records.type.sent')}</Tab>
            <Tab>{t('red-envelope-records.type.received')}</Tab>
          </TabList>
        </Tabs>
      </AppbarSticky>
      {tabIndex === 0 ? <Sent /> : null}
      {tabIndex === 1 ? <Received /> : null}
    </MainContainer>
  )
}
