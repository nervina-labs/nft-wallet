import React, { useState, useCallback, useReducer, useMemo } from 'react'
import { Redirect, useHistory } from 'react-router'
import styled from 'styled-components'
import { Appbar, AppbarButton } from '../../components/Appbar'
import { MainContainer } from '../../styles'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as CameraSvg } from '../../assets/svg/camera-avatar.svg'
import { useTranslation } from 'react-i18next'
import { SetBirthday } from './setBirthday'
import { DrawerAction } from './DrawerAction'
import { ProfilePath, RoutePath } from '../../routes'
import { getRegionFromCode, SetRegion } from './SetRegion'
import { useRouteMatch } from 'react-router-dom'
import { useSetServerProfile } from '../../hooks/useProfile'
import { useQuery, useQueryClient } from 'react-query'
import { Query } from '../../models'
import { Skeleton } from '@material-ui/lab'
import { DrawerImage } from './DrawerImage'
import { HolderAvatar } from '../../components/HolderAvatar'
import { useAccount, useAccountStatus, useAPI } from '../../hooks/useAccount'
import { Input, Select } from './Input'
import { Stack, Center, Button } from '@mibao-ui/components'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  background: white;

  .main {
    flex: 1;

    .avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      -webkit-tap-highlight-color: transparent;

      margin-top: 25px;
      margin-bottom: 25px;
      flex-direction: column;
      cursor: pointer;

      img {
        display: block;
        width: 72px;
        height: 72px;
      }

      .cam {
        position: relative;
        top: -10px;
        z-index: 10;
      }
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    padding: 20px;
    width: 100%;
    max-width: 500px;
  }
`

export interface FormState {
  nickname?: string
  gender?: string
  birthday?: string
  region?: string
  description?: string
}

export interface FormAction {
  key: keyof FormState
  value: string
}

export const Profile: React.FC = () => {
  const history = useHistory()
  const { t, i18n } = useTranslation('translations')
  const [showGenderAction, setShowGenderAction] = useState(false)
  const [showAvatarAction, setShowAvatarAction] = useState(false)
  const api = useAPI()
  const { isLogined } = useAccountStatus()
  const { address } = useAccount()
  const matchRegion = useRouteMatch({
    path: ProfilePath.Regions,
    strict: false,
  })
  const matchBirthday = useRouteMatch({
    path: ProfilePath.Birthday,
    strict: true,
  })

  const [formState, dispatch] = useReducer(
    (prevState: FormState, { key, value }: FormAction) => {
      return { ...prevState, [key]: value }
    },
    {}
  )

  const { data: user, isFetching, refetch } = useQuery(
    [Query.Profile, address],
    async () => {
      const profile = await api.getProfile()
      return profile
    },
    {
      enabled: !!address,
      refetchOnWindowFocus: false,
      onSuccess(user) {
        dispatch({ key: 'birthday', value: user.birthday })
        dispatch({ key: 'description', value: user.description })
        dispatch({ key: 'gender', value: user.gender })
        dispatch({ key: 'region', value: user.region })
        dispatch({ key: 'nickname', value: user.nickname })
      },
    }
  )

  const setRemoteProfile = useSetServerProfile()
  const [errorMsg, setErrorMsg] = useState<string>()
  const [isSending, setIsSending] = useState(false)
  const isDisabled = typeof errorMsg === 'string'
  const qc = useQueryClient()
  const onSubmit = useCallback(
    async (shouldRefetch = true) => {
      setIsSending(true)
      try {
        await setRemoteProfile(formState)
      } catch (error) {
        //
        alert('set profile failed')
      } finally {
        setIsSending(false)
        setShowGenderAction(false)
        if (shouldRefetch) {
          await qc.refetchQueries(Query.Profile)
        }
      }
    },
    [setRemoteProfile, formState, qc]
  )

  const isDataChanged = useMemo(() => {
    return (
      formState.birthday !== user?.birthday ||
      formState.description !== user?.description ||
      formState.gender !== user?.gender ||
      formState.nickname !== user?.nickname ||
      formState.region !== user?.region
    )
  }, [user, formState])

  const onConfirm = useConfirmDialog()

  const goBack = useCallback(() => {
    history.replace(RoutePath.NFTs)
  }, [history])

  const onGoBack = useCallback(async () => {
    if (isDataChanged && !isDisabled) {
      try {
        await onConfirm({
          type: 'text',
          title: t('profile.save-edit'),
          async onConfirm() {
            await onSubmit(false)
          },
          onCancel: goBack,
        })
      } catch {
        //
        return
      }
    }
    goBack()
  }, [isDataChanged, isDisabled, goBack, onConfirm, t, onSubmit])

  if (!isLogined) {
    return <Redirect to={RoutePath.Explore} />
  }

  return (
    <Container>
      <Appbar
        title={t('profile.title')}
        left={
          <AppbarButton onClick={onGoBack}>
            <BackSvg />
          </AppbarButton>
        }
        right={<div />}
      />
      <section className="main">
        <div className="avatar">
          <Center
            flexDirection="column"
            onClick={() => setShowAvatarAction(true)}
          >
            {isFetching ? (
              <Skeleton variant="circle" width={72} height={72} />
            ) : (
              <HolderAvatar
                tid={user?.avatar_tid}
                avatar={user?.avatar_url}
                avatarType={user?.avatar_type}
                size={72}
              />
            )}
            <CameraSvg className="cam" />
          </Center>
        </div>
        <Stack spacing="12px" px="20px" mb="90px">
          <Input
            label={t('profile.username')}
            placeholder={`${t('profile.input')}${t('profile.username')}`}
            value={formState.nickname}
            formatter={(v: string) => v.trim().slice(0, 24)}
            onChange={(e) => {
              const value = e.target.value
              dispatch({ key: 'nickname', value })
              if (value.length < 2) {
                setErrorMsg(t('profile.user-name.desc'))
              } else {
                // eslint-disable-next-line no-void
                setErrorMsg(void 0)
              }
            }}
            max={24}
            errorMsg={errorMsg}
          />
          <Select
            label={t('profile.gender')}
            value={
              formState.gender ? t(`profile.${formState.gender}`) : undefined
            }
            onClick={() => {
              setShowGenderAction(true)
            }}
          />
          <Select
            label={t('profile.birthday')}
            value={formState.birthday}
            onClick={() => history.push(ProfilePath.Birthday)}
          />
          <Select
            label={t('profile.region')}
            value={
              getRegionFromCode(formState.region, i18n.language) || undefined
            }
            onClick={() => history.push(ProfilePath.Regions)}
          />
          <Input
            label={t('profile.description')}
            placeholder={`${t('profile.input')}${t('profile.description')}`}
            value={formState.description}
            formatter={(v: string) => v.slice(0, 100)}
            onChange={(e) =>
              dispatch({ key: 'description', value: e.target.value })
            }
            isTextarea
            max={100}
          />
        </Stack>
      </section>
      <footer className="footer">
        <Button
          colorScheme="primary"
          variant="solid"
          onClick={onSubmit}
          type="submit"
          isFullWidth
          isLoading={isSending}
          isDisabled={isDisabled}
        >
          {t('profile.save')}
        </Button>
      </footer>
      <SetBirthday
        open={!!matchBirthday?.isExact}
        close={() => history.goBack()}
        birthday={user?.birthday}
      />
      <SetRegion
        open={matchRegion != null}
        region={user?.region}
        close={() => {
          history.goBack()
        }}
      />
      <DrawerAction
        isDrawerOpen={showGenderAction}
        close={() => setShowGenderAction(false)}
        actions={[
          { content: t('profile.male'), value: 'male' },
          { content: t('profile.female'), value: 'female' },
        ]}
        actionOnClick={(value) => {
          dispatch({ key: 'gender', value })
          setShowGenderAction(false)
        }}
      />
      <DrawerImage
        showAvatarAction={showAvatarAction}
        setShowAvatarAction={setShowAvatarAction}
        reloadProfile={refetch}
      />
    </Container>
  )
}
