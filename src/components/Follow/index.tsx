import { CircularProgress } from '@material-ui/core'
import classNames from 'classnames'
import React, { useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useConfirm } from '../../hooks/useConfirm'
import { useFollowStatus } from '../../hooks/useFollowStatus'
import { useProfileModel } from '../../hooks/useProfile'
import { useAPI, useAccountStatus } from '../../hooks/useAccount'
import { RoutePath } from '../../routes'

const Container = styled.button`
  border-radius: 20px;
  border: none;
  background: #ff6e30;
  border: 0.5px solid #ff5c00;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  width: 70px;
  min-width: 70px;
  height: 22px;
  font-size: 12px;
  transition: all 0.5s;

  &.followed {
    border: 0.5px solid #999999;
    background: transparent;
    color: #999999;
  }

  &.disabled {
    pointer-events: none;
  }
`

export interface FollowProps {
  followed: boolean
  uuid: string
  afterToggle?: (params?: any) => Promise<any>
}

export const Follow: React.FC<FollowProps> = ({
  followed,
  uuid,
  afterToggle,
}) => {
  const [t] = useTranslation('translations')
  const api = useAPI()
  const { isLogined } = useAccountStatus()
  const confirm = useConfirm()
  const { followStatus, setFollowStatus } = useFollowStatus()
  const { getAuth } = useProfileModel()
  const isFollow = useMemo(() => {
    return followStatus[uuid] ?? followed
  }, [followStatus, uuid, followed])
  const [isLoading, setIsLoading] = useState(false)
  const toggle = useCallback(async () => {
    const auth = await getAuth()
    const { data } = await api.toggleFollow(uuid, auth)
    setFollowStatus(uuid, data.followed)
    try {
      await afterToggle?.()
    } catch (error) {
      //
    }
    // afterToggle?.(data.followed)
  }, [getAuth, api, uuid, afterToggle, setFollowStatus])
  const history = useHistory()

  const toggleFollow = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()
      if (!isLogined) {
        history.push(RoutePath.Login)
        return
      }
      try {
        if (isFollow) {
          await confirm(
            t('follow.confirm'),
            async () => {
              setIsLoading(true)
              await toggle()
            },
            () => {}
          )
        } else {
          setIsLoading(true)
          await toggle()
        }
      } catch (error) {
        //
      } finally {
        setIsLoading(false)
      }
    },
    [isFollow, confirm, toggle, t, history, isLogined]
  )

  return (
    <Container
      onClick={toggleFollow}
      className={classNames({ followed: isFollow, disabled: isLoading })}
      disabled={isLoading}
    >
      {isLoading ? (
        <CircularProgress className="loading" size="1em" />
      ) : !isFollow ? (
        `+ ${t('follow.follow')}`
      ) : (
        t('follow.followed')
      )}
    </Container>
  )
}
