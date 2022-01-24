import { Box } from '@chakra-ui/react'
import { Appbar, AppbarSticky } from '../../components/Appbar'
import { Tabs, Tab, TabList } from '@mibao-ui/components'

export const RedEnvelopeRecord: React.FC = () => {
  return (
    <Box>
      <AppbarSticky>
        <Appbar title="红包记录" />
        <Tabs colorScheme="black">
          <TabList justifyContent="center">
            <Tab mr="24px">发出</Tab>
            <Tab>收到</Tab>
          </TabList>
        </Tabs>
      </AppbarSticky>
    </Box>
  )
}
