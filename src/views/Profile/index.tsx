import React, { useState } from 'react'
import { Redirect, useHistory, useLocation } from 'react-router'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { MainContainer } from '../../styles'
import { ReactComponent as CameraSvg } from '../../assets/svg/camera-avatar.svg'
import { useTranslation } from 'react-i18next'
import { SetBirthday } from './setBirthday'
import { DrawerAction } from './DrawerAction'
import { ProfilePath, RoutePath } from '../../routes'
import { getRegionFromCode, SetRegion } from './SetRegion'
import { useRouteMatch } from 'react-router-dom'
import { useGetAndSetAuth, useSetServerProfile } from '../../hooks/useProfile'
import { useQuery, useQueryClient } from 'react-query'
import { Query } from '../../models'
import { DrawerImage } from './DrawerImage'
import { useAccount, useAccountStatus, useAPI } from '../../hooks/useAccount'
import { Select } from './Input'
import { Stack, Center, Avatar } from '@mibao-ui/components'
import { getNFTQueryParams } from '../../utils'
import { SetDesc } from './setDesc'
import { SetUsername } from './setUserName'
import { useToast } from '../../hooks/useToast'
import { TakePhoto } from './TakePhoto'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  background: white;

  .main {
    flex: 1;

    .cam {
      position: relative;
      top: -10px;
      z-index: 10;
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

  const matchDesc = useRouteMatch(ProfilePath.Description)
  const matchUsername = useRouteMatch(ProfilePath.Username)
  const getAuth = useGetAndSetAuth()

  const { data: user, refetch } = useQuery(
    [Query.Profile, address],
    async () => {
      const auth = await getAuth()
      const profile = await api.getProfile('', auth)
      return profile
    },
    {
      enabled: !!address,
      refetchOnWindowFocus: false,
    }
  )

  const setRemoteProfile = useSetServerProfile()
  const qc = useQueryClient()

  const toast = useToast()

  const location = useLocation<{ showCamera: boolean }>()

  const showCamera = !!location.state?.showCamera

  if (!isLogined) {
    return <Redirect to={RoutePath.Explore} />
  }

  return showCamera ? (
    <TakePhoto />
  ) : (
    <Container>
      <Appbar title={t('profile.title')} right={<div />} />
      <section className="main">
        <Center flexDirection="column" my="24px">
          <Avatar
            src={user?.avatar_url || ''}
            type={user?.avatar_type}
            resizeScale={200}
            size="72px"
            onClick={() => setShowAvatarAction(true)}
            srcQueryParams={getNFTQueryParams(user?.avatar_tid, i18n.language)}
            customizedSize={{
              fixed: 'small',
            }}
          />
          <CameraSvg className="cam" />
        </Center>
        <Stack spacing="12px" px="20px" mb="90px">
          <Select
            label={t('profile.username')}
            value={user?.nickname}
            placeholder={`${t('profile.input')}${t('profile.username')}`}
            onClick={() => {
              history.push(ProfilePath.Username)
            }}
          />
          <Select
            label={t('profile.gender')}
            value={user?.gender ? t(`profile.${user?.gender}`) : undefined}
            onClick={() => {
              setShowGenderAction(true)
            }}
          />
          <Select
            label={t('profile.birthday')}
            value={user?.birthday}
            onClick={() => history.push(ProfilePath.Birthday)}
          />
          <Select
            label={t('profile.region')}
            value={getRegionFromCode(user?.region, i18n.language) || undefined}
            onClick={() => history.push(ProfilePath.Regions)}
          />
          <Select
            label={t('profile.description')}
            value={
              Number(user?.description?.length) > 20
                ? user?.description.slice(0, 20) + '...'
                : user?.description
            }
            placeholder={`${t('profile.input')}${t('profile.description')}`}
            onClick={() => {
              history.push(ProfilePath.Description)
            }}
          />
        </Stack>
      </section>
      <SetUsername
        username={user?.nickname}
        open={!!matchUsername?.isExact}
        close={() => history.goBack()}
      />
      <SetDesc
        desc={user?.description}
        open={!!matchDesc?.isExact}
        close={() => history.goBack()}
      />
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
        actionOnClick={async (value) => {
          await setRemoteProfile({
            gender: value,
          })
          setShowGenderAction(false)
          toast(t('profile.success'))
          await qc.refetchQueries(Query.Profile)
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
