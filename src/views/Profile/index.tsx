import React, { useState } from 'react'
import { Redirect, useHistory } from 'react-router'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { MainContainer } from '../../styles'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as RightArrowSvg } from '../../assets/svg/right-arrow.svg'
import { ReactComponent as CameraSvg } from '../../assets/svg/camera-avatar.svg'
import ProfileBg from '../../assets/svg/profile-bg.svg'
import { useTranslation } from 'react-i18next'
import { LazyLoadImage } from '../../components/Image'
import PeopleSvg from '../../assets/svg/people.svg'
import { SetUsername } from './SetUsername'
import { SetDesc } from './setDesc'
import { SetBirthday } from './setBirthday'
import { DrawerAcion } from './DrawerAction'
import { ProfilePath, RoutePath } from '../../routes'
import { useWalletModel } from '../../hooks/useWallet'
import { SetRegion } from './SetRegion'
import { useRouteMatch } from 'react-router-dom'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  background: white url(${ProfileBg as any}) no-repeat;
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

      svg {
        position: relative;
        top: -10px;
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
      color: #333;
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
  const { t } = useTranslation('translations')
  // const [isEditingUsername, setIsEditingUsername] = useState(false)
  // const [isEditingDesc, setIsEditingDesc] = useState(false)
  // const [isEditingBirthDay, setIsEditingBirthday] = useState(false)
  const [showGenderAction, setShowGenderAction] = useState(false)
  const [showAvatarAction, setShowAvatarAction] = useState(false)
  const { isLogined } = useWalletModel()
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
            <LazyLoadImage width={90} height={90} src={PeopleSvg as any} />
            <CameraSvg />
          </div>
        </div>
        <Row
          label={t('profile.username')}
          placeholder={t('profile.input')}
          onClick={() => {
            history.push(ProfilePath.Username)
          }}
        />
        <Row
          label={t('profile.gender')}
          placeholder={t('profile.select')}
          onClick={() => setShowGenderAction(true)}
        />
        <Row
          label={t('profile.birthday')}
          placeholder={t('profile.select')}
          onClick={() => history.push(ProfilePath.Birthday)}
        />
        <Row
          label={t('profile.region')}
          placeholder={t('profile.select')}
          onClick={() => history.push(ProfilePath.Regions)}
        />
        <Row
          label={t('profile.description')}
          placeholder={t('profile.input')}
          onClick={() => history.push(ProfilePath.Description)}
        />
      </section>
      <SetUsername
        open={!!matchUsername?.isExact}
        close={() => history.goBack()}
      />
      <SetDesc open={!!matchDesc?.isExact} close={() => history.goBack()} />
      <SetBirthday
        open={!!matchBirthday?.isExact}
        close={() => history.goBack()}
      />
      <SetRegion
        open={matchRegion != null}
        close={() => {
          history.push(RoutePath.Profile)
        }}
      />
      <DrawerAcion
        isDrawerOpen={showGenderAction}
        close={() => setShowGenderAction(false)}
        actions={[
          { content: t('profile.male'), value: 'male' },
          { content: t('profile.female'), value: 'female' },
        ]}
        actionOnClick={(val) => console.log(val)}
      />
      <DrawerAcion
        isDrawerOpen={showAvatarAction}
        close={() => setShowAvatarAction(false)}
        actions={[
          { content: t('profile.avatar.camera'), value: 'camera' },
          {
            content: (
              <label htmlFor="upload" className="label">
                {t('profile.avatar.photo-lib')}
                <input
                  type="file"
                  id="upload"
                  accept="image/*"
                  onChange={(e) => {
                    const [file] = e.target.files ?? []
                    if (file) {
                      history.push(RoutePath.ImagePreview, {
                        datauri: URL.createObjectURL(file),
                      })
                    }
                  }}
                  style={{ display: 'none' }}
                />
              </label>
            ),
            value: 'lib',
          },
        ]}
        actionOnClick={(val) => {
          if (val === 'camera') {
            history.push(RoutePath.TakePhoto)
          }
        }}
      />
    </Container>
  )
}
