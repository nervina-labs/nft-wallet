import { Drawer } from '@material-ui/core'
import React, { useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { useWidth } from '../../hooks/useWidth'
import { CONTAINER_MAX_WIDTH } from '../../constants'
import { UserResponse } from '../../models/user'
import { User } from './User'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { useHistory } from 'react-router-dom'
import { RoutePath } from '../../routes'
import { useTranslation } from 'react-i18next'
import { ReactComponent as ProfileSvg } from '../../assets/svg/profile.svg'
import { ReactComponent as TxSvg } from '../../assets/svg/tx-list.svg'
import { ReactComponent as LangSvg } from '../../assets/svg/language.svg'
import { ReactComponent as HelpSvg } from '../../assets/svg/help.svg'
import { DrawerAction } from '../Profile/DrawerAction'
import { LocalCache } from '../../cache'
import { getHelpCenterUrl } from '../../data/help'
import { useLogout } from '../../hooks/useAccount'

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
  user?: UserResponse
  setShowAvatarAction: (show: boolean) => void
}

export const DrawerMenu: React.FC<DrawerConfigProps> = ({
  close,
  isDrawerOpen,
  user,
  setShowAvatarAction,
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
        icon: <LangSvg />,
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
        anchor="left"
        open={isDrawerOpen}
        onBackdropClick={close}
        PaperProps={{
          style: {
            position: 'absolute',
            width: '280px',
            left: drawerLeft,
          },
        }}
        disableEnforceFocus
        disableEscapeKeyDown
      >
        <DrawerContainer>
          <div className="user">
            <User
              user={user}
              setShowAvatarAction={setShowAvatarAction}
              closeMenu={close}
            />
          </div>
          <Divider />
          <List style={{ marginTop: '28px' }}>
            {list.map(({ text, icon, onClick }, index) => (
              <ListItem
                button
                key={text}
                onClick={onClick}
                style={{ padding: '12px 16px' }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <div className="footer">
            <ListItem
              button
              onClick={() => logout(history)}
              style={{ textAlign: 'center', padding: '12px 16px' }}
            >
              <ListItemText primary={t('menu.logout')} />
            </ListItem>
          </div>
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
