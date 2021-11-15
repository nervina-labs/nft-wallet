import React, { Suspense } from 'react'
import { createPortal } from 'react-dom'
import styled from '@emotion/styled'
import { Loading } from '@mibao-ui/components'

const LoaderContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 99999;
`

const body = document.body

class PortalLoader extends React.Component {
  el = document.createElement('div')

  componentDidMount() {
    body.appendChild(this.el)
  }

  componentWillUnmount() {
    body.removeChild(this.el)
  }

  render() {
    return createPortal(this.props.children, this.el)
  }
}

export const GlobalLoader: React.FC = () => {
  return (
    <PortalLoader>
      <LoaderContainer>
        <Loading size="lg" color="white" />
      </LoaderContainer>
    </PortalLoader>
  )
}

export const LoadableComponent: React.FC = ({ children }) => {
  return <Suspense fallback={<GlobalLoader />}>{children}</Suspense>
}
