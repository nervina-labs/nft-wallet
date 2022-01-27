import { Appbar, AppbarSticky } from '../../components/Appbar'
import { Tabs, Tab, TabList } from '@mibao-ui/components'
import { MainContainer } from '../../styles'
import { Sent } from './components/sent'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Received } from './components/received'

export const RedEnvelopeRecord: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const { t } = useTranslation('translations')

  return (
    <MainContainer>
      <AppbarSticky>
        <Appbar title={t('red-envelope-records.title')} />
        <Tabs colorScheme="black" onChange={setTabIndex} bg="white">
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
