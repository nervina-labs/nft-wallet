import React, { useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { useWidth } from '../../hooks/useWidth'
import { CONTAINER_MAX_WIDTH } from '../../constants'
import { useHistory } from 'react-router-dom'
import { RoutePath } from '../../routes'
import { useTranslation } from 'react-i18next'
import { ReactComponent as OrderSvg } from '../../assets/svg/home/order.svg'
import { ReactComponent as ProfileSvg } from '../../assets/svg/home/profile.svg'
import { ReactComponent as TxSvg } from '../../assets/svg/home/tx.svg'
import { ReactComponent as LocaleSvg } from '../../assets/svg/home/locale.svg'
import { ReactComponent as HelpSvg } from '../../assets/svg/home/help.svg'
import { ReactComponent as LogoutSvg } from '../../assets/svg/home/logout.svg'
import { DrawerAction } from '../Profile/DrawerAction'
import { LocalCache } from '../../cache'
import { getHelpCenterUrl } from '../../data/help'
import { useLogout } from '../../hooks/useAccount'
import { Drawer, Stack, StackDivider, Text, Flex } from '@mibao-ui/components'

const DrawerContainer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  .user {
    padding: 32px 20px;
    > div {
      margin: 0;
    }
  }

  .footer {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    margin-top: auto;
    height: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

export interface ActionProps {
  content: React.ReactNode
  value: string
}

export interface DrawerConfigProps {
  children?: React.ReactNode
  close: () => void
  isDrawerOpen: boolean
}

export const DrawerMenu: React.FC<DrawerConfigProps> = ({
  close,
  isDrawerOpen,
}) => {
  const bodyRef = useRef(document.body)
  const bodyWidth = useWidth(bodyRef)
  const [showAction, setShowAction] = useState(false)
  const history = useHistory()
  const { t, i18n } = useTranslation('translations')
  const logout = useLogout()

  const drawerLeft = useMemo(() => {
    if (bodyWidth == null) {
      return 0
    }
    if (bodyWidth <= CONTAINER_MAX_WIDTH) {
      return 0
    }
    return `${(bodyWidth - CONTAINER_MAX_WIDTH) / 2}px`
  }, [bodyWidth])

  const list = useMemo(() => {
    return [
      {
        text: t('menu.order'),
        icon: <OrderSvg />,
        onClick: () => history.push(RoutePath.Orders),
      },
      {
        text: t('menu.profile'),
        icon: <ProfileSvg />,
        onClick: () => history.push(RoutePath.Profile),
      },
      {
        text: t('menu.txs'),
        icon: <TxSvg />,
        onClick: () => history.push(RoutePath.Transactions),
      },
      {
        text: t('menu.language'),
        icon: <LocaleSvg />,
        onClick: () => {
          close()
          setShowAction(true)
        },
      },
      {
        text: t('menu.help'),
        icon: <HelpSvg />,
        onClick: () =>
          history.push(
            `${RoutePath.Help}?url=${encodeURIComponent(
              getHelpCenterUrl(i18n.language)
            )}`
          ),
      },
      {
        text: t('menu.logout'),
        icon: <LogoutSvg />,
        onClick: () => logout(history),
      },
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, history])

  const setLanguage = async (lang: string): Promise<void> => {
    setShowAction(false)
    await i18n.changeLanguage(lang)
    LocalCache.setI18nLng(lang as 'zh')
    document.title = t('common.title')
  }

  return (
    <>
      <Drawer
        placement="left"
        isOpen={isDrawerOpen}
        onClose={close}
        hasOverlay
        rounded="xl"
        contentProps={{
          w: '300px',
          style: {
            left: drawerLeft,
          },
        }}
      >
        <DrawerContainer>
          <Stack
            mt="50px"
            spacing="20px"
            divider={<StackDivider borderColor="gray.200" />}
          >
            {list.map(({ text, icon, onClick }, index) => (
              <Flex
                key={text}
                onClick={onClick}
                cursor="pointer"
                justifyContent="space-between"
                alignItems="center"
                w="100%"
              >
                <Flex justifyContent="space-between" alignItems="center">
                  {icon}
                  <Text ml="16px" fontSize="16px">
                    {text}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Stack>
        </DrawerContainer>
      </Drawer>
      <DrawerAction
        isDrawerOpen={showAction}
        close={() => setShowAction(false)}
        actions={[
          { content: t('menu.zh'), value: 'zh' },
          { content: t('menu.en'), value: 'en' },
        ]}
        actionOnClick={setLanguage}
      />
    </>
  )
}
