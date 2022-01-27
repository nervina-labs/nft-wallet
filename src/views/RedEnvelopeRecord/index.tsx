import { Appbar, AppbarSticky } from '../../components/Appbar'
import { Tabs, Tab, TabList } from '@mibao-ui/components'
import { MainContainer } from '../../styles'
import { Sent } from './components/sent'
import { useState } from 'react'

export const RedEnvelopeRecord: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <MainContainer>
      <AppbarSticky>
        <Appbar title="红包记录" />
        <Tabs colorScheme="black" onChange={setTabIndex} bg="white">
          <TabList justifyContent="center">
            <Tab mr="24px">发出</Tab>
            <Tab>收到</Tab>
          </TabList>
        </Tabs>
      </AppbarSticky>
      {tabIndex === 0 ? <Sent /> : null}
    </MainContainer>
  )
}
