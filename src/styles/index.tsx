import styled from 'styled-components'
import { CONTAINER_MAX_WIDTH } from '../constants'

export const MainContainer = styled.main`
  margin: 0 auto;
  max-width: ${CONTAINER_MAX_WIDTH}px;
  background: linear-gradient(187.7deg, #ffffff 4.33%, #f0f0f0 94.27%);
  min-height: calc(100% - 44px);
  padding-top: 44px;
`
