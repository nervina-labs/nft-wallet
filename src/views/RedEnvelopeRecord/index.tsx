import { TabPanel, TabPanels } from '@chakra-ui/react'
import { Appbar, AppbarSticky } from '../../components/Appbar'
import { Tabs, Tab, TabList } from '@mibao-ui/components'
import { MainContainer } from '../../styles'
import { Sent } from './components/sent'

export const RedEnvelopeRecord: React.FC = () => {
  return (
    <MainContainer>
      <AppbarSticky>
        <Appbar title="红包记录" />
        <Tabs colorScheme="black">
          <TabList justifyContent="center">
            <Tab mr="24px">发出</Tab>
            <Tab>收到</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Sent />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </AppbarSticky>
    </MainContainer>
  )
}
