import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as BuySvg } from '../../assets/svg/buy.svg'
import { ReactComponent as ShareSvg } from '../../assets/svg/share.svg'
import Buypng from '../../assets/img/buy.png'
import { Redirect, useHistory, useParams, useRouteMatch } from 'react-router'
import { useWidth } from '../../hooks/useWidth'
import { useQuery } from 'react-query'
import { NFTDetail, Query } from '../../models'
import { useWalletModel } from '../../hooks/useWallet'
import { Limited } from '../../components/Limited'
import { Creator } from '../../components/Creator'
import { Share } from '../../components/Share'
import { MainContainer } from '../../styles'
import {
  IS_MAC_SAFARI,
  IS_WEXIN,
  MAIN_NET_URL,
  WEAPP_ID,
} from '../../constants'
import { RoutePath } from '../../routes'
import { useTranslation } from 'react-i18next'
import { ParallaxTilt } from '../../components/ParallaxTilt'
import { TokenClass, VipSource } from '../../models/class-list'
import { Like } from '../../components/Like'
import { useLikeStatusModel } from '../../hooks/useLikeStatus'
import type Tilt from 'react-better-tilt'
import 'react-photo-view/dist/index.css'
import { Follow } from '../../components/Follow'
import { useProfileModel } from '../../hooks/useProfile'

import { ReactComponent as CardBackSvg } from '../../assets/svg/card-back.svg'
import { useWechatLaunchWeapp } from '../../hooks/useWechat'
import { Tab, Tabs } from '../../components/Tab'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { TokenHolderList } from './HolderList'
import { StatusText } from './StatusText'

const CardBackIconContainer = styled.div`
  border-bottom-left-radius: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 8px;
  top: 8px;
  background: rgba(0, 0, 0, 0.33);
  backdrop-filter: blur(4px);
`

const CardBackIcon: React.FC<{
  onClick: (e: React.SyntheticEvent) => void
}> = ({ onClick }) => {
  return (
    <CardBackIconContainer onClick={onClick}>
      <CardBackSvg />
    </CardBackIconContainer>
  )
}

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
    padding: 0 25px 100px;
    border-radius: 25px 25px 0 0;
    position: relative;
    margin-bottom: 10px;
    background-color: #f7fafd;
    min-height: calc(100vh - 450px);
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
    .issuer {
      display: flex;
      /* justify-content: center; */
      align-items: center;
      margin-bottom: 8px;
      > div {
        flex: 1;
        margin-right: 8px;
      }
    }
    .vip {
      color: #999;
      font-size: 12px;
    }
    .desc-title {
      font-size: 16px;
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
    .buy-container {
      position: absolute;
      right: 25px;
      top: -20px;
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
      svg {
        margin-bottom: 4px;
      }
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
  z-index: 100;
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

const TabsContainer = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);

  .tabs {
    transform: translateY(1px);
  }

  .tab {
    font-size: 14px;
  }
`

interface FooterProps {
  nft: NFTDetail | TokenClass
}

const Footer: React.FC<FooterProps> = ({ nft }) => {
  const { id } = useParams<{ id: string }>()
  const classUuid = isTokenClass(nft) ? id : nft.class_uuid
  return (
    <FooterContaienr>
      <Limited
        count={nft.total}
        bold={false}
        sn={isTokenClass(nft) ? undefined : nft.n_token_id}
        fontSize={14}
        color="#999"
      />
      <Like count={nft.class_likes} uuid={classUuid} liked={nft.class_liked} />
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
  const { getAuth } = useProfileModel()

  const isHolder = !!useRouteQuery<string>('holder', '')

  const { data, failureCount } = useQuery(
    [Query.NFTDetail, id, api, isLogined],
    async () => {
      const auth = isLogined ? await getAuth() : undefined
      if (matchTokenClass?.isExact) {
        const { data } = await api.getTokenClass(id, auth)
        return data
      }
      const { data } = await api.getNFTDetail(id, auth)
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

  const productID = data?.product_on_sale_uuid

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

  const { setLikeStatus } = useLikeStatusModel()

  useEffect(() => {
    if (data == null) {
      return
    }
    const classId = isTokenClass(data) ? id : data.class_uuid
    setLikeStatus(classId, data.class_liked)
  }, [data, id, setLikeStatus])

  const verifyTitle = detail?.verified_info?.verified_title

  const cachedInnerHeight = useMemo(() => {
    return window.innerHeight
  }, [])

  const qrcode = useMemo(() => {
    return data?.product_qr_code
  }, [data])

  const { initWechat, isWechatInited } = useWechatLaunchWeapp()
  useEffect(() => {
    initWechat().catch(Boolean)
  }, [])

  const buyButton = useMemo(() => {
    if (!qrcode) {
      return null
    }

    if (IS_WEXIN && productID && isWechatInited) {
      const weappHtml = `
        <wx-open-launch-weapp
        id="launch-btn"
        username="${WEAPP_ID}"
        path="pages/detail/index.html?scene=${productID}"
      >
        <script type="text/wxtag-template">
          <style>
            .buy {
              background-color: #fd5c31;
              width: 60px;
              height: 60px;
              cursor: pointer;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              font-size: 10px;
              border-radius: 50%;
              color: white;
            }
            .icon {
              width: 14px;
              height: 14px;
              margin-bottom: 4px;
            }
          </style>
          <div class="buy">
            <img class="icon" src="${Buypng as string}" />
            <span>${t('shop.buy')}</span>
          </div>
        </script>
      </wx-open-launch-weapp>
      `
      return (
        <div
          className="buy-container"
          dangerouslySetInnerHTML={{ __html: weappHtml }}
        />
      )
    }
    return (
      <div
        className="transfer"
        onClick={() => history.push(`${RoutePath.Shop}?qrcode=${qrcode}`)}
      >
        <BuySvg />
        <span>{t('shop.buy')}</span>
      </div>
    )
  }, [qrcode, history, t, productID, isWechatInited])

  const innerHeight = IS_MAC_SAFARI ? cachedInnerHeight : window.innerHeight
  const [showCardBack, setShowCardBack] = useState(false)
  const hasCardBack = useMemo(() => {
    return (
      !!data?.card_back_content_exist || !!data?.class_card_back_content_exist
    )
  }, [data])
  const [disbaleTilt] = useState(false)
  const tiltRef = useRef<Tilt>(null)
  const cardBackOnClick = useCallback(
    (e: React.SyntheticEvent) => {
      const autoResetEvent = new CustomEvent('autoreset')
      // @ts-expect-error
      tiltRef.current?.onMove(autoResetEvent)
      tiltRef?.current?.reset()
      if (hasCardBack) {
        // disable Gyroscope
      }
      setShowCardBack((show) => !show)
      // setDisableTile(false)
    },
    [hasCardBack]
  )

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
          style={{ height: `${innerHeight - 44 - 280}px` }}
        />
      ) : null}
      <div
        className="figure"
        style={{
          height: `${innerHeight - 44 - 300}px`,
          background: 'transparent',
        }}
      >
        <ParallaxTilt
          src={detail?.bg_image_url}
          width={imageWidth}
          height={imageWidth}
          enable={!isDialogOpen && !disbaleTilt}
          onFallBackImageLoaded={() => setFallBackImgLoaded(true)}
          onColorDetected={(color) => setImageColor(color)}
          type={detail?.renderer_type}
          renderer={detail?.renderer}
          cardBackContent={
            detail?.card_back_content ?? detail?.class_card_back_content
          }
          tiltRef={tiltRef}
          flipped={showCardBack}
        />
        {hasCardBack ? <CardBackIcon onClick={cardBackOnClick} /> : null}
      </div>
      {detail == null ? null : (
        <>
          <section
            className="detail"
            style={{
              top: `${innerHeight - 44 - 300}px`,
            }}
          >
            {isTokenClass(detail) ? (
              buyButton
            ) : (
              <div
                className={`${!isTransferable ? 'disabled' : ''} transfer`}
                onClick={isTransferable ? tranfer : undefined}
              >
                <span className="arrow">&#8594;</span>
                <span>{t('nft.transfer')}</span>
              </div>
            )}
            <div className="title">{detail?.name}</div>
            <div className="issuer">
              <Creator
                title=""
                url={detail.issuer_info?.avatar_url}
                name={detail.issuer_info?.name}
                uuid={detail.issuer_info?.uuid}
                color="#000"
                fontSize={14}
                isVip={detail?.verified_info?.is_verified}
                vipTitle={verifyTitle}
                vipSource={detail?.verified_info?.verified_source}
                showTooltip={false}
                replace={true}
                useImageFallBack={true}
              />
              <Follow
                followed={detail?.issuer_info?.issuer_followed as boolean}
                uuid={detail?.issuer_info?.uuid as string}
              />
            </div>
            {verifyTitle ? (
              <div className="vip">
                {detail?.verified_info?.verified_source === VipSource.Weibo
                  ? t('common.vip.weibo', { title: verifyTitle })
                  : verifyTitle}
              </div>
            ) : null}
            <TabsContainer>
              <Tabs activeKey={isHolder ? 1 : 0} className="tabs">
                <Tab
                  className="tab"
                  active={!isHolder}
                  onClick={() => history.replace(history.location.pathname)}
                >
                  NFT简介
                </Tab>
                <Tab
                  className="tab"
                  active={isHolder}
                  onClick={() =>
                    history.replace(history.location.pathname + '?holder=true')
                  }
                >
                  收藏者
                </Tab>
              </Tabs>
            </TabsContainer>

            {!isHolder ? (
              detail?.description ? (
                <div className="desc">{detail?.description}</div>
              ) : (
                <StatusText>{t('nft.no-desc')}</StatusText>
              )
            ) : (
              <TokenHolderList id={(detail as NFTDetail).class_uuid ?? id} />
            )}
          </section>
          <Footer nft={detail} />
        </>
      )}
      <Share
        isDialogOpen={isDialogOpen}
        closeDialog={closeDialog}
        displayText={MAIN_NET_URL + history.location.pathname}
        copyText={MAIN_NET_URL + history.location.pathname}
      />
    </Container>
  )
}
