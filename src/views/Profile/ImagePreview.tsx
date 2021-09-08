import { CircularProgress } from '@material-ui/core'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { Redirect, useHistory, useLocation } from 'react-router'
import styled from 'styled-components'
import { useProfileModel } from '../../hooks/useProfile'
import { useWalletModel } from '../../hooks/useWallet'
import { Query } from '../../models'
import { RoutePath, useRoute } from '../../routes'
import { MainContainer } from '../../styles'
import { AvatarType } from '../../models/user'

const Container = styled(MainContainer)`
  min-height: 100%;
  max-height: 100%;
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
    max-width: 100%;
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
interface HistoryData {
  datauri?: string
  ext?: string
  fromCamera?: boolean
  tokenUuid?: string
}

export const ImagePreview: React.FC = () => {
  const width = `${(window.innerWidth > 500 ? 500 : window.innerWidth) - 50}px`
  const [t] = useTranslation('translations')
  const history = useHistory()
  const location = useLocation<HistoryData>()
  const [isSaving, setIsSaving] = useState(false)
  const { setRemoteProfile } = useProfileModel()

  const [datauri, ext, fromCamera, tokenUuid] = useMemo(() => {
    return [
      location.state.datauri,
      location.state.ext,
      location.state.fromCamera,
      location.state.tokenUuid,
    ]
  }, [location.state])
  const { confirm, toast } = useWalletModel()

  const isBlob = useMemo(() => datauri?.startsWith('blob:'), [datauri])

  useEffect(() => {
    return () => {
      if (isBlob) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        URL.revokeObjectURL(datauri!)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const qc = useQueryClient()
  const route = useRoute()
  const onSave = useCallback(async () => {
    if (isSaving) {
      return
    }
    setIsSaving(true)
    try {
      if (!tokenUuid) {
        await setRemoteProfile(
          {
            avatar: datauri,
            avatar_type: AvatarType.Image,
          },
          { ext }
        )
      } else {
        await setRemoteProfile({
          avatar_token_uuid: tokenUuid,
          avatar_type: AvatarType.Token,
        })
      }
      if (fromCamera) {
        history.go(-2)
      } else {
        history.replace(route.from)
      }
    } catch (error: any) {
      // axios error
      if (error?.message?.includes('Network Error')) {
        toast(t('profile.image-network-error'))
      } else if (
        error?.response?.data?.detail?.includes('should be less than')
      ) {
        toast(t('profile.size-limit'))
      } else if (error?.response?.data?.detail?.includes('allowed types')) {
        toast(t('profile.wrong-image-format'))
      } else {
        toast(error?.response?.data?.detail ?? error?.message ?? error)
      }
      // alert('upload failed')
    } finally {
      await qc.refetchQueries(Query.Profile)
      setIsSaving(false)
    }
  }, [
    datauri,
    setRemoteProfile,
    tokenUuid,
    history,
    isSaving,
    ext,
    qc,
    fromCamera,
    toast,
    t,
    route,
  ])

  const onClose = useCallback(() => {
    confirm(t('profile.save-edit'), onSave, () => {
      if (fromCamera) {
        history.go(-2)
      } else {
        history.goBack()
      }
    }).catch(Boolean)
  }, [confirm, onSave, history, t, fromCamera])

  if (!datauri && !tokenUuid) {
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
            onClick={() => history.replace(RoutePath.TakePhoto)}
          >
            {t('profile.reshot')}
          </div>
        ) : (
          <div className="cancel" onClick={onClose}>
            {t('profile.cancel')}
          </div>
        )}
        <div className="comfirm" onClick={onSave}>
          {isSaving ? <CircularProgress size="1em" /> : t('profile.comfirm')}
        </div>
      </footer>
    </Container>
  )
}
