import React, { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as ShareSvg } from '../../assets/svg/share.svg'
import { Redirect, useHistory, useParams } from 'react-router'
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

const Background = styled.div`
  position: absolute;
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
  }
  .loading {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }
  .detail {
    padding: 0 25px;
    border-radius: 25px 25px 0px 0px;
    height: 300px;
    max-height: 300px;
    position: relative;
    background-color: #f7fafd;
    .title {
      font-weight: 500;
      font-size: 20px;
      line-height: 41px;
      color: #0e0e0e;
      margin-top: 45px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .desc {
      font-size: 14px;
      line-height: 18px;
      color: #484848;
      margin-top: 18px;
      white-space: pre-line;
      word-break: break-all;
      padding-bottom: 80px;
    }
    .transfer {
      background-color: #fd5c31;
      width: 70px;
      height: 70px;
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
  nft: NFTDetail
}

const Footer: React.FC<FooterProps> = ({ nft }) => {
  return (
    <FooterContaienr>
      <Creator
        title=""
        url={nft.issuer_info.avatar_url}
        name={nft.issuer_info.name}
        uuid={nft.issuer_info.uuid}
        color="#000"
        fontSize={14}
      />
      <Limited
        count={nft.total}
        bold={false}
        sn={nft.n_token_id}
        fontSize={14}
        // color="rgba(63, 63, 63, 0.66) !important"
      />
    </FooterContaienr>
  )
}

export const NFT: React.FC = () => {
  const history = useHistory()
  const { t } = useTranslation('translations')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFallBackImgLoaded, setFallBackImgLoaded] = useState(false)
  const [imageColor, setImageColor] = useState<string>()
  const closeDialog = (): void => setIsDialogOpen(false)

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
    return `${NFT_EXPLORER_URL}/nft/${data?.class_uuid ?? ''}`
  }, [data])

  const isTransferable = useMemo(() => {
    if (detail === undefined) {
      return false
    }
    return (
      address !== '' &&
      detail.tx_state !== 'pending' &&
      address === detail.to_address
    )
  }, [address, detail])

  if (!isLogined) {
    return <Redirect to={RoutePath.Login} />
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
          <section className="detail">
            <div
              className={`${!isTransferable ? 'disabled' : ''} transfer`}
              onClick={isTransferable ? tranfer : undefined}
            >
              <span className="arrow">&#8594;</span>
              <span>{t('nft.transfer')}</span>
            </div>
            <div className="title">{detail?.name}</div>
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
