import { CircularProgress, Drawer } from '@material-ui/core'
import React, { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import styled from 'styled-components'
import { useWidth } from '../../hooks/useWidth'
import { CONTAINER_MAX_WIDTH } from '../../constants'

const DrawerContainer = styled.div`
  height: 100%;
  background-color: ${(props: { bg: string }) => props.bg};
  .username {
    margin: 0 20px;
    margin-top: 38px;
  }

  .adornment {
    color: #999;
    font-size: 12px;
  }

  .desc {
    margin-top: 10px;
    font-size: 12px;
    line-height: 24px;
    color: #999;
    margin-left: 16px;
  }

  .birthday {
    .datepicker-caption {
      padding: 0;
      .datepicker-caption-item {
        font-size: 16px;
      }
    }
    .datepicker-caption-item {
      background-color: white;
    }
    .ios {
      background-color: white;
    }
    .datepicker {
      bottom: inherit;

      li {
        font-size: 16px;
      }
    }

    .datepicker-viewport {
      &::after {
        background: linear-gradient(
          white,
          rgba(245, 245, 245, 0) 52%,
          rgba(245, 245, 245, 0) 48%,
          white
        );
      }
    }
  }
`

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 78px;
  background: white;
  color: #2c454c;
  border-bottom: 1px solid #ccc;
  .left {
    width: 50px;
    text-align: left;
    margin-left: 25px;
    height: 30px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .title {
    flex: 1;
    text-align: center;
    font-size: 17px;
    line-height: 30px;
  }
  .right {
    text-align: right;
    margin-right: 25px;
    font-size: 14px;
    line-height: 30px;
    width: 50px;
    color: #2c454c;
    cursor: pointer;

    &.invalid {
      color: #ccc;
      cursor: not-allowed;
    }
  }
`

export interface DrawerConfigProps {
  children?: React.ReactNode
  title: React.ReactNode
  isSaving?: boolean
  close: () => void
  isDrawerOpen: boolean
  isValid: boolean
  onSaving?: () => void
  onClose?: () => void
  bg?: string
}

export const DrawerConfig: React.FC<DrawerConfigProps> = ({
  children,
  isSaving,
  title,
  close,
  isDrawerOpen,
  isValid,
  onSaving,
  onClose,
  bg = 'white',
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
      onClose={onClose}
      PaperProps={{
        style: {
          position: 'absolute',
          width: drawerLeft === 0 ? '100%' : `${CONTAINER_MAX_WIDTH}px`,
          left: drawerLeft,
          borderTopLeftRadius: '25px',
          borderTopRightRadius: '25px',
          height: `${window.innerHeight - 44}px`,
        },
      }}
      disableEnforceFocus
      disableEscapeKeyDown
    >
      <DrawerContainer bg={bg}>
        <Header>
          <span className="left" onClick={close}>
            <BackSvg />
          </span>
          <span className="title">{title}</span>
          <span
            className={`right ${isValid ? '' : 'invalid'}`}
            onClick={isValid && !isSaving ? onSaving : undefined}
          >
            {isSaving ? (
              <CircularProgress size="1em" className="loading" />
            ) : (
              t('profile.save')
            )}
          </span>
        </Header>
        {children}
      </DrawerContainer>
    </Drawer>
  )
}
