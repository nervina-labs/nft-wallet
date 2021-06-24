import React, { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as ShareSvg } from '../../assets/svg/share.svg'
import { Redirect, useHistory, useParams, useRouteMatch } from 'react-router'
import { useWidth } from '../../hooks/useWidth'
import { useQuery } from 'react-query'
import { NFTDetail, Query } from '../../models'
import { useWalletModel } from '../../hooks/useWallet'
import { Loading } from '../../components/Loading'
import { Limited } from '../../components/Limited'
import { Creator } from '../../components/Creator'
import { Share } from '../../components/Share'
import { MainContainer } from '../../styles'
import { NFT_EXPLORER_URL } from '../../constants'
import { RoutePath } from '../../routes'
import { useTranslation } from 'react-i18next'
import { ParallaxTilt } from '../../components/ParallaxTilt'
import { TokenClass } from '../../models/class-list'
import { Like } from '../../components/Like'
import Divider from '@material-ui/core/Divider'

const Background = styled.div`
  position: fixed;
  top: 44px;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  &:before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url(${(props: { url?: string }) => props.url}) 50% / cover
      border-box padding-box;
    content: '';
    border-color: transparent;
    background-clip: border-box;
    border-color: transparent;
    background-clip: border-box;
    filter: blur(50px);
  }
`

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  background: ${(props: { bgColor?: string }) =>
    `${
      props.bgColor?.startsWith('radial')
        ? '#393d41'
        : 'linear-gradient(107.86deg, #e1e1e1 7.34%, #d3d3d3 92.99%)'
    }`};
  .figure {
    flex: 1;
    display: flex;
    justify-content: center;
    position: fixed;
    width: 100%;
    max-width: 500px;
  }
  .loading {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }
  .detail {
    padding: 0 25px;
    border-radius: 25px 25px 0px 0px;
    position: relative;
    margin-bottom: 10px;
    background-color: #f7fafd;
    .title {
      font-weight: 500;
      font-size: 20px;
      line-height: 24px;
      color: #0e0e0e;
      margin-top: 45px;
      display: -webkit-box;
      display: -moz-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      margin-bottom: 16px;
    }
    .vip {
      color: #999;
      font-size: 12px;
    }
    .desc-title {
      font-size: 18px;
      line-height: 20px;
      margin-bottom: 8px;
    }
    .desc {
      font-size: 14px;
      line-height: 18px;
      color: #484848;
      margin-top: 18px;
      white-space: pre-line;
      word-break: break-all;
      padding-bottom: 80px;
      display: -webkit-box;
      display: -moz-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 20;
      line-clamp: 20;
      /* margin-bottom: 10px; */
    }
    .transfer {
      background-color: #fd5c31;
      width: 60px;
      height: 60px;
      cursor: pointer;
      position: absolute;
      right: 25px;
      top: -20px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      font-size: 10px;
      border-radius: 50%;
      color: white;
      &.disabled {
        background-color: #ddd;
        color: #898989;
        cursor: not-allowed;
      }
      .arrow {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
`

const FooterContaienr = styled.footer`
  position: fixed;
  bottom: 0;
  height: 80px;
  display: flex;
  align-items: center;
  background: #ffffff;
  width: 100%;
  max-width: 500px;
  border-radius: 35px 35px 0px 0px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.06);
  > div {
    &:first-child {
      margin-left: 23px;
      flex: 1;
      width: 200px;
    }
    &:last-child {
      margin-left: 4px;
      margin-right: 23px;
    }
  }
`

interface FooterProps {
  nft: NFTDetail | TokenClass
}

const Footer: React.FC<FooterProps> = ({ nft }) => {
  const classUuid = isTokenClass(nft) ? nft.uuid : nft.class_uuid
  return (
    <FooterContaienr>
      <Limited
        count={nft.total}
        bold={false}
        sn={isTokenClass(nft) ? undefined : nft.n_token_id}
        fontSize={14}
        color="#999"
      />
      <Like count={nft.class_likes} uuid={classUuid} liked={nft.liked} />
    </FooterContaienr>
  )
}

function isTokenClass(data?: TokenClass | NFTDetail): data is TokenClass {
  return !!data && !('tx_state' in data)
}

export const NFT: React.FC = () => {
  const history = useHistory()
  const { t } = useTranslation('translations')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFallBackImgLoaded, setFallBackImgLoaded] = useState(false)
  const [imageColor, setImageColor] = useState<string>()
  const closeDialog = (): void => setIsDialogOpen(false)
  const matchTokenClass = useRouteMatch(RoutePath.TokenClass)
  const appRef = useRef(null)
  const width = useWidth(appRef)
  const imageWidth = useMemo(() => {
    // 72 = figure padding
    return width !== undefined ? width - 72 : 0
  }, [width])

  const { id } = useParams<{ id: string }>()
  const { api, address, isLogined } = useWalletModel()

  const { data, failureCount } = useQuery(
    [Query.NFTDetail, id, api],
    async () => {
      if (matchTokenClass?.isExact) {
        const { data } = await api.getTokenClass(id)
        return data
      }
      const { data } = await api.getNFTDetail(id)
      return data
    },
    { enabled: id != null }
  )
  const detail = data

  const tranfer = useCallback(() => {
    history.push(`/transfer/${id}`, {
      nftDetail: detail,
    })
  }, [history, id, detail])

  const openDialog = useCallback(() => {
    if (data !== undefined) {
      setIsDialogOpen(true)
    }
  }, [data])

  const bgColor = useMemo(() => {
    if (isFallBackImgLoaded) {
      return 'rgb(178, 217, 229)'
    }
    return imageColor
  }, [isFallBackImgLoaded, imageColor])

  const explorerURL = useMemo(() => {
    if (isTokenClass(data)) {
      return `${NFT_EXPLORER_URL}/nft/${id ?? ''}`
    }
    return `${NFT_EXPLORER_URL}/nft/${data?.class_uuid ?? ''}`
  }, [data, id])

  const isTransferable = useMemo(() => {
    if (detail === undefined) {
      return false
    }
    if (isTokenClass(detail)) {
      return false
    }
    return (
      address !== '' &&
      detail.tx_state !== 'pending' &&
      address === detail.to_address
    )
  }, [address, detail])

  if (!isLogined && matchTokenClass?.isExact !== true) {
    return <Redirect to={RoutePath.Explore} />
  }

  if (
    failureCount >= 3 ||
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    detail?.is_class_banned ||
    detail?.is_issuer_banned
  ) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return (
    <Container bgColor={bgColor}>
      <Appbar
        title={t('nft.title')}
        left={<BackSvg onClick={() => history.goBack()} />}
        right={<ShareSvg onClick={openDialog} />}
        ref={appRef}
      />
      {!isFallBackImgLoaded ? (
        <Background
          url={detail?.bg_image_url}
          style={{ height: `${window.innerHeight - 44 - 280}px` }}
        />
      ) : null}
      <div
        className="figure"
        style={{
          height: `${window.innerHeight - 44 - 300}px`,
          background: `${
            isFallBackImgLoaded ? 'rgb(178, 217, 229)' : 'transparent'
          }`,
        }}
      >
        <ParallaxTilt
          src={detail?.bg_image_url}
          width={imageWidth}
          height={imageWidth}
          enable={!isDialogOpen}
          onFallBackImageLoaded={() => setFallBackImgLoaded(true)}
          onColorDetected={(color) => setImageColor(color)}
        />
      </div>
      {detail == null ? (
        <section className="detail">
          <Loading />
        </section>
      ) : (
        <>
          <section
            className="detail"
            style={{
              top: `${window.innerHeight - 44 - 300}px`,
            }}
          >
            {isTokenClass(detail) ? null : (
              <div
                className={`${!isTransferable ? 'disabled' : ''} transfer`}
                onClick={isTransferable ? tranfer : undefined}
              >
                <span className="arrow">&#8594;</span>
                <span>{t('nft.transfer')}</span>
              </div>
            )}
            <div className="title">{detail?.name}</div>
            <Creator
              title=""
              url={detail.issuer_info.avatar_url}
              name={detail.issuer_info.name}
              uuid={detail.issuer_info.uuid}
              color="#000"
              fontSize={14}
              isVip={detail?.weibo_auth_info?.is_verified}
              vipTitle={detail?.weibo_auth_info?.verified_title}
              style={{ marginBottom: '5px' }}
            />
            {detail?.weibo_auth_info?.verified_title ? (
              <div className="vip">
                {detail?.weibo_auth_info?.verified_title}
              </div>
            ) : null}
            <Divider style={{ margin: '24px 0' }} />
            <div className="desc-title">{t('nft.desc')}</div>
            <div className="desc">{detail?.description}</div>
          </section>
          <Footer nft={detail} />
        </>
      )}
      <Share
        isDialogOpen={isDialogOpen}
        closeDialog={closeDialog}
        displayText={explorerURL}
        copyText={explorerURL}
      />
    </Container>
  )
}
