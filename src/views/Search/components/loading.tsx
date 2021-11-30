import { ReactComponent as LoadingSvg } from '../../../assets/svg/loading.svg'
import styled from '@emotion/styled'

export const Loading = styled(LoadingSvg)`
  width: 30px;
  height: 30px;
  margin: 0 auto;
  animation: loading 1.5s infinite linear;
  @keyframes loading {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`
