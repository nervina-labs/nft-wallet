import React, { useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useFollowStatus } from '../../hooks/useFollowStatus'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { useAPI, useAccountStatus } from '../../hooks/useAccount'
import { RoutePath } from '../../routes'
import { Button } from '@mibao-ui/components'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'

export interface FollowProps {
  followed: boolean
  uuid: string
  afterToggle?: (params?: any) => Promise<any>
  isPrimary?: boolean
}

export const Follow: React.FC<FollowProps> = ({
  followed,
  uuid,
  afterToggle,
  isPrimary = false,
}) => {
  const [t] = useTranslation('translations')
  const api = useAPI()
  const { isLogined } = useAccountStatus()
  const onConfirm = useConfirmDialog()
  const { followStatus, setFollowStatus } = useFollowStatus()
  const getAuth = useGetAndSetAuth()
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
          await onConfirm({
            type: 'text',
            title: t('follow.confirm'),
            async onConfirm() {
              setIsLoading(true)
              await toggle()
            },
            onCancel() {},
          })
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
    [isLogined, history, isFollow, onConfirm, t, toggle]
  )

  return (
    <Button
      isLoading={isLoading}
      size="sm"
      colorScheme={isPrimary ? 'primary' : 'gray'}
      variant={isPrimary && !isFollow ? 'solid' : 'outline'}
      isDisabled={isLoading}
      onClick={toggleFollow}
      fontWeight="normal"
      borderRadius="10px"
      px="16px"
      color={isPrimary ? undefined : isFollow ? 'gray' : undefined}
    >
      {!isFollow ? t('follow.follow') : t('follow.followed')}
    </Button>
  )
}
