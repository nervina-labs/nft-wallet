import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, useHistory, useLocation } from 'react-router'
import styled from 'styled-components'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'

const Container = styled(MainContainer)`
  min-height: 100%;
  padding: 0;
  position: relative;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: black;

  .image {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
    }

    .circle {
      width: ${(props: { width: string }) => props.width};
      height: ${(props: { width: string }) => props.width};
      position: absolute;
      border-radius: 50%;
      box-sizing: border-box;
      box-shadow: 0 0 0 9999em rgb(0 0 0 / 50%);
    }
  }

  footer {
    position: absolute;
    bottom: 50px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 0 25px;
    color: white;
    font-size: 16px;
    .cancel {
      margin-left: 25px;
      cursor: pointer;
    }
    .comfirm {
      margin-right: 25px;
      cursor: pointer;
      color: #fe6035;
    }
  }
`

export const ImagePreview: React.FC = () => {
  const width = `${(window.innerWidth > 500 ? 500 : window.innerWidth) - 50}px`
  const [t] = useTranslation('translations')
  const history = useHistory()
  const location = useLocation<{ datauri?: string }>()

  const datauri = useMemo(() => {
    return location.state.datauri
  }, [location.state])

  const isBlob = useMemo(() => datauri?.startsWith('blob:'), [datauri])

  useMemo(() => {
    return () => {
      if (isBlob) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        URL.revokeObjectURL(datauri!)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (datauri == null) {
    return <Redirect to={RoutePath.Profile} />
  }

  return (
    <Container width={width}>
      <div className="image">
        <img src={datauri} />
        <div className="circle" />
      </div>
      <footer>
        {!isBlob ? (
          <div
            className="cancel"
            onClick={() => history.push(RoutePath.TakePhoto)}
          >
            {t('profile.reshot')}
          </div>
        ) : (
          <div
            className="cancel"
            onClick={() => history.push(RoutePath.Profile)}
          >
            {t('profile.cancel')}
          </div>
        )}
        <div className="comfirm">{t('profile.comfirm')}</div>
      </footer>
    </Container>
  )
}
