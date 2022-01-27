import { Appbar, AppbarSticky } from '../../components/Appbar'
import { MainContainer } from '../../styles'

export const RedEnvelopeReceived: React.FC = () => {
  return (
    <MainContainer>
      <AppbarSticky>
        <Appbar title="红包详情" />
      </AppbarSticky>
    </MainContainer>
  )
}
