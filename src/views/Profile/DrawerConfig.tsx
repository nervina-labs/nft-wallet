import React, { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import styled from 'styled-components'
import { useWidth } from '../../hooks/useWidth'
import { CONTAINER_MAX_WIDTH } from '../../constants'
import classNames from 'classnames'
import { Drawer, Loading } from '@mibao-ui/components'
import { DrawerContentProps } from '@chakra-ui/modal'
import { HEADER_HEIGHT } from '../../components/Appbar'

const DrawerContainer = styled.div`
  height: 100%;
  background-color: ${(props: { bg: string }) => props.bg};
  .username {
    margin: 0 20px;
    margin-top: 38px;
  }
  .container {
    margin: 0 20px;
    margin-top: 10px;
    .alert {
      font-size: 11px;
      color: #d03a3a;
      margin-top: 8px;
    }
  }
  .label {
    font-size: 14px;
    margin-top: 16px;
    margin-bottom: 8px;
  }

  .adornment-container {
    position: absolute;
    bottom: 18px;
    right: 8px;
    > span {
      color: #fb5d3b;
    }
  }

  .warning {
    margin-top: 4px;
    font-size: 10px;
    color: #d03a3a;
  }

  .MuiAlert-root {
    font-size: 12px;
    margin: 16px 0;
    margin-bottom: 80px;
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
  height: 60px;
  background: white;
  color: #2c454c;

  .left {
    width: 50px;
    text-align: left;
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
    font-size: 14px;
    line-height: 30px;
    width: 50px;
    color: #2c454c;
    cursor: pointer;

    &.invalid {
      color: #ccc;
      cursor: not-allowed;
    }

    &.hidden {
      visibility: hidden;
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
  showSave?: boolean
  bg?: string
  height?: string
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
  showSave = true,
  height,
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
  const fullHeight = useMemo(() => {
    return window.innerHeight - HEADER_HEIGHT
  }, [])

  const drawerContentProps: DrawerContentProps = {
    width: drawerLeft === 0 ? '100%' : `${CONTAINER_MAX_WIDTH}px`,
    style: {
      left: drawerLeft,
    },
    overflow: 'hidden',
    height: height ?? fullHeight,
  }

  if (height) {
    drawerContentProps.borderRadius = '20px'
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    drawerContentProps.style!.bottom = '40px'
  }

  return (
    <Drawer
      placement="bottom"
      isOpen={isDrawerOpen}
      onClose={close}
      hasOverlay
      rounded="lg"
      contentProps={drawerContentProps}
    >
      <DrawerContainer bg={bg}>
        <Header>
          <span className="left" onClick={close}>
            <BackSvg />
          </span>
          <span className="title">{title}</span>
          {
            <span
              className={classNames('right', {
                invalid: !isValid,
                hidden: !showSave,
              })}
              onClick={isValid && !isSaving ? onSaving : undefined}
            >
              {isSaving ? (
                <Loading size="sm" className="loading" />
              ) : (
                t('profile.save')
              )}
            </span>
          }
        </Header>
        {children}
      </DrawerContainer>
    </Drawer>
  )
}
