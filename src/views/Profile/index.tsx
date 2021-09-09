import React, { useState, useCallback } from 'react'
import { Redirect, useHistory } from 'react-router'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { MainContainer } from '../../styles'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as RightArrowSvg } from '../../assets/svg/right-arrow.svg'
import { ReactComponent as CameraSvg } from '../../assets/svg/camera-avatar.svg'
import ProfileBg from '../../assets/svg/profile-bg.svg'
import { useTranslation } from 'react-i18next'
import { SetUsername } from './SetUsername'
import { SetDesc } from './setDesc'
import { SetBirthday } from './setBirthday'
import { DrawerAction } from './DrawerAction'
import { ProfilePath, RoutePath } from '../../routes'
import { useWalletModel } from '../../hooks/useWallet'
import { getRegionFromCode, SetRegion } from './SetRegion'
import { useRouteMatch } from 'react-router-dom'
import { useProfileModel } from '../../hooks/useProfile'
import { useQuery, useQueryClient } from 'react-query'
import { Query } from '../../models'
import { Skeleton } from '@material-ui/lab'
import { DrawerImage } from './DrawerImage'
import { HolderAvatar } from '../../components/HolderAvatar'

const profileBg = ProfileBg

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  background: white url(${profileBg}) no-repeat;
  background-size: cover;

  .main {
    flex: 1;

    .avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      -webkit-tap-highlight-color: transparent;

      margin-top: 32px;
      margin-bottom: 40px;
      flex-direction: column;
      cursor: pointer;

      img {
        display: block;
        width: 90px;
        height: 90px;
      }

      .cam {
        position: relative;
        top: -10px;
        z-index: 10;
      }
    }
  }
`

const RowContainer = styled.div`
  padding: 14px 5px;
  margin: 0 20px;
  padding-right: 0;
  display: flex;
  align-items: center;
  .label {
    font-size: 15px;
    line-height: 18px;
    color: black;
  }

  .content {
    color: #999;
    margin-left: auto;
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 15px;
    /* line-height: 18px; */
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    .value {
      flex: 1;
      text-align: right;
      margin-left: 30px;
      color: #333;
      display: -moz-box;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      word-break: break-all;
      text-overflow: ellipsis;
    }

    .arrow {
      margin-left: 8px;
    }
  }
`

interface RowProps {
  label: React.ReactNode
  value?: React.ReactNode
  onClick?: () => void
  placeholder: React.ReactNode
}

const Row: React.FC<RowProps> = ({ label, value, onClick, placeholder }) => {
  return (
    <RowContainer>
      <span className="label">{label}</span>
      <span className="content" onClick={onClick}>
        <span className={`${value ? 'value' : ''}`}>
          {value ?? placeholder}
        </span>
        <RightArrowSvg className="arrow" />
      </span>
    </RowContainer>
  )
}

export const Profile: React.FC = () => {
  const history = useHistory()
  const { t, i18n } = useTranslation('translations')
  const [showGenderAction, setShowGenderAction] = useState(false)
  const [showAvatarAction, setShowAvatarAction] = useState(false)
  const { isLogined, address, api } = useWalletModel()
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

  const { data: user, isFetching, refetch } = useQuery(
    [Query.Profile, address],
    async () => {
      const profile = await api.getProfile()
      return profile
    },
    {
      enabled: !!address,
      refetchOnWindowFocus: false,
    }
  )

  const { setRemoteProfile } = useProfileModel()
  const qc = useQueryClient()
  const onSaveGender = useCallback(
    async (gender: string) => {
      try {
        await setRemoteProfile({
          gender,
        })
        history.push(RoutePath.Profile)
      } catch (error) {
        //
        alert('set profile failed')
      } finally {
        setShowGenderAction(false)
        await qc.refetchQueries(Query.Profile)
      }
    },
    [setRemoteProfile, history, qc]
  )

  if (!isLogined) {
    return <Redirect to={RoutePath.Explore} />
  }

  return (
    <Container>
      <Appbar
        title={t('profile.title')}
        left={<BackSvg onClick={() => history.push(RoutePath.NFTs)} />}
        right={<div />}
      />
      <section className="main">
        <div className="avatar">
          <div
            style={{ textAlign: 'center' }}
            onClick={() => setShowAvatarAction(true)}
          >
            {isFetching ? (
              <Skeleton variant="circle" width={90} height={90} />
            ) : (
              <HolderAvatar
                avatar={user?.avatar_url}
                avatarType={user?.avatar_type}
                size={90}
              />
            )}
            <CameraSvg className="cam" />
          </div>
        </div>
        <Row
          label={t('profile.username')}
          placeholder={t('profile.input')}
          value={user?.nickname}
          onClick={() => {
            history.push(ProfilePath.Username)
          }}
        />
        <Row
          label={t('profile.gender')}
          placeholder={t('profile.select')}
          value={user?.gender ? t(`profile.${user?.gender}`) : undefined}
          onClick={() => setShowGenderAction(true)}
        />
        <Row
          label={t('profile.birthday')}
          placeholder={t('profile.select')}
          value={user?.birthday}
          onClick={() => history.push(ProfilePath.Birthday)}
        />
        <Row
          label={t('profile.region')}
          placeholder={t('profile.select')}
          value={getRegionFromCode(user?.region, i18n.language)}
          onClick={() => history.push(ProfilePath.Regions)}
        />
        <Row
          label={t('profile.description')}
          placeholder={t('profile.input')}
          value={user?.description}
          onClick={() => history.push(ProfilePath.Description)}
        />
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
        actionOnClick={onSaveGender}
      />
      <DrawerImage
        showAvatarAction={showAvatarAction}
        setShowAvatarAction={setShowAvatarAction}
        reloadProfile={refetch}
      />
    </Container>
  )
}
