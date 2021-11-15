import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { Redirect, useHistory, useLocation } from 'react-router'
import styled from 'styled-components'
import { useSetServerProfile } from '../../hooks/useProfile'
import { Query } from '../../models'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { AvatarType } from '../../models/user'
import { LazyLoadImage } from '../../components/Image'
import { addParamsToUrl } from '../../utils'
import i18n from 'i18next'
import { useRoute } from '../../hooks/useRoute'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'
import { Loading } from '@mibao-ui/components'
import Fallback from '../../assets/svg/fallback.svg'

const Container = styled(MainContainer)`
  min-height: 100%;
  max-height: 100%;
  padding: 0;
  position: relative;
  max-width: 500px;
  width: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
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
    .confirm {
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
  tid?: string
}

const MAX_WIDTH = 500

export const ImagePreview: React.FC = () => {
  const imageWidth = Math.min(MAX_WIDTH, window.innerWidth)
  const circleWidth = imageWidth - 50
  const [t] = useTranslation('translations')
  const history = useHistory()
  const location = useLocation<HistoryData>()
  const [isSaving, setIsSaving] = useState(false)
  const setRemoteProfile = useSetServerProfile()

  const [datauri, ext, fromCamera, tokenUuid] = useMemo(() => {
    const datauri = addParamsToUrl(location?.state?.datauri ?? '', {
      ...(location.state.tid
        ? {
            tid: location.state.tid,
            locale: i18n.language === 'en' ? 'en' : 'zh',
          }
        : {}),
    })
    return [
      datauri,
      location.state.ext,
      location.state.fromCamera,
      location.state.tokenUuid,
    ]
  }, [location.state])
  const onConfirm = useConfirmDialog()

  const isBlob = useMemo(() => datauri?.startsWith('blob:'), [datauri])

  useEffect(() => {
    return () => {
      if (isBlob) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        URL.revokeObjectURL(datauri)
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
        history.replace(RoutePath.Profile)
      } else {
        history.replace(route.from)
      }
    } catch (error: any) {
      // axios error
      if (error?.message?.includes('Network Error')) {
        onConfirm({
          type: 'error',
          title: t('profile.image-network-error'),
        })
      } else if (
        error?.response?.data?.detail?.includes('should be less than')
      ) {
        onConfirm({
          type: 'error',
          title: t('profile.size-limit'),
        })
      } else if (error?.response?.data?.detail?.includes('allowed types')) {
        onConfirm({
          type: 'error',
          title: t('profile.wrong-image-format'),
        })
      } else {
        onConfirm({
          type: 'error',
          title: error?.response?.data?.detail ?? error?.message ?? error,
        })
      }
      // alert('upload failed')
    } finally {
      await qc.refetchQueries(Query.Profile)
      setIsSaving(false)
    }
  }, [
    isSaving,
    tokenUuid,
    fromCamera,
    setRemoteProfile,
    datauri,
    ext,
    history,
    route.from,
    onConfirm,
    t,
    qc,
  ])

  const onClose = useCallback(() => {
    onConfirm({
      type: 'text',
      title: t('profile.save-edit'),
      onConfirm: onSave,
      onCancel() {
        if (fromCamera) {
          history.replace(RoutePath.Profile)
        } else {
          history.goBack()
        }
      },
    })
  }, [onConfirm, t, onSave, fromCamera, history])

  if (!datauri && !tokenUuid) {
    return <Redirect to={RoutePath.Profile} />
  }

  return (
    <Container width={`${circleWidth}px`}>
      <div className="image">
        <LazyLoadImage
          src={datauri}
          width={imageWidth}
          height={imageWidth}
          backup={<img src={Fallback} />}
        />
        <div className="circle" />
      </div>
      <footer>
        {!isBlob && !tokenUuid ? (
          <div
            className="cancel"
            onClick={() => {
              history.replace(RoutePath.Profile, {
                showCamera: true,
              })
            }}
          >
            {t('profile.reshot')}
          </div>
        ) : (
          <div className="cancel" onClick={onClose}>
            {t('profile.cancel')}
          </div>
        )}
        <div className="confirm" onClick={onSave}>
          {isSaving ? <Loading size="sm" /> : t('profile.confirm')}
        </div>
      </footer>
    </Container>
  )
}
