import React, { useMemo, useRef } from 'react'
// import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useWidth } from '../../hooks/useWidth'
import { CONTAINER_MAX_WIDTH } from '../../constants'
import { Drawer } from '@mibao-ui/components'

const DrawerContainer = styled.div``

export const OrderDrawer: React.FC = () => {
  const bodyRef = useRef(document.body)
  const bodyWidth = useWidth(bodyRef)

  const drawerLeft = useMemo(() => {
    if (bodyWidth == null) {
      return 0
    }
    if (bodyWidth <= CONTAINER_MAX_WIDTH) {
      return 0
    }
    return `${(bodyWidth - CONTAINER_MAX_WIDTH) / 2}px`
  }, [bodyWidth])

  return (
    <Drawer
      placement="bottom"
      isOpen={true}
      hasOverlay
      onClose={close}
      rounded="lg"
      contentProps={{
        width: drawerLeft === 0 ? '100%' : `${CONTAINER_MAX_WIDTH}px`,
        style: {
          left: drawerLeft,
          bottom: '40px',
        },
        borderRadius: '20px',
      }}
    >
      <DrawerContainer></DrawerContainer>
    </Drawer>
  )
}
