/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import { MainContainer } from '../../styles'
import { useHistory } from 'react-router'
import { RoutePath } from '../../routes'
import { useTranslation } from 'react-i18next'
import { ReactComponent as SwitchCam } from '../../assets/svg/switch-cam.svg'
import Webcam from 'react-webcam'

const Container = styled(MainContainer)`
  min-height: 100%;
  padding: 0;
  position: relative;
  max-width: 500px;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: black;

  footer {
    position: absolute;
    bottom: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: white;
    font-size: 18px;
    .cancel {
      margin-left: 40px;
      cursor: pointer;
    }
    .switch {
      margin-right: 40px;
      cursor: pointer;
    }

    .circle {
      width: 90px;
      height: 90px;
      background: #d8d8d8;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      .inner-circle {
        width: 70px;
        border-radius: 50%;
        height: 70px;
        background: #feffff;
      }
    }
  }
`

type FacingMode = 'user' | 'environment'

export const TakePhoto: React.FC = () => {
  const camera = useRef<Webcam>(null)
  const [facingMode, setFacingMode] = useState<FacingMode>('environment')
  const history = useHistory()
  const [t] = useTranslation('translations')
  const toggle = useCallback(() => {
    setFacingMode(facingMode === 'environment' ? 'user' : 'environment')
  }, [facingMode])

  const takePhoto = useCallback(() => {
    const datauri = camera.current?.getScreenshot()
    history.push(RoutePath.ImagePreview, {
      datauri,
      fromCamera: true,
    })
  }, [history])

  return (
    <Container>
      <Webcam
        ref={camera}
        audio={false}
        videoConstraints={{ facingMode }}
        style={{ objectFit: 'cover', height: '100%', width: '100%' }}
        screenshotFormat="image/jpeg"
        screenshotQuality={0.92}
        height={window.innerHeight}
        onUserMediaError={() => {
          alert(t('login.errors.refuse'))
          history.push(RoutePath.Profile)
        }}
      />
      <footer>
        <div className="cancel" onClick={() => history.goBack()}>
          {t('profile.cancel')}
        </div>
        <div className="circle" onClick={takePhoto}>
          <div className="inner-circle" />
        </div>
        <SwitchCam className="switch" onClick={toggle} />
      </footer>
    </Container>
  )
}
