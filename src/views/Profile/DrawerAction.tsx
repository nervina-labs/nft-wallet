import { Drawer } from '@material-ui/core'
import React, { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useWidth } from '../../hooks/useWidth'
import { CONTAINER_MAX_WIDTH } from '../../constants'

export const Action = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  background-color: white;
  font-size: 18px;
  line-height: 18px;
  color: black;
  cursor: pointer;
  margin-bottom: 1px;

  label {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`

const DrawerContainer = styled.div`
  background-color: #e3e3e3;
`

export interface ActionProps {
  content: React.ReactNode
  value: string
}

export interface DrawerConfigProps {
  children?: React.ReactNode
  close: () => void
  isDrawerOpen: boolean
  actions: ActionProps[]
  actionOnClick: (value: string) => void
}

export const DrawerAction: React.FC<DrawerConfigProps> = ({
  close,
  isDrawerOpen,
  actions,
  actionOnClick,
}) => {
  const [t] = useTranslation('translations')
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
      anchor="bottom"
      open={isDrawerOpen}
      onBackdropClick={close}
      PaperProps={{
        style: {
          position: 'absolute',
          width: drawerLeft === 0 ? '100%' : `${CONTAINER_MAX_WIDTH}px`,
          left: drawerLeft,
          borderTopLeftRadius: '25px',
          borderTopRightRadius: '25px',
        },
      }}
      variant="temporary"
      disableEnforceFocus
      disableEscapeKeyDown
      disableScrollLock={window.innerWidth >= 500}
    >
      <DrawerContainer>
        {actions.map((action) => {
          return (
            <Action
              onClick={() => actionOnClick(action.value)}
              key={action.value}
            >
              {action.content}
            </Action>
          )
        })}
        <Action
          style={{ paddingBottom: '16px', marginTop: '10px' }}
          onClick={close}
        >
          {t('profile.cancel')}
        </Action>
      </DrawerContainer>
    </Drawer>
  )
}
