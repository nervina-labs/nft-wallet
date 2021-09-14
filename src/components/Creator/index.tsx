import React, { useMemo } from 'react'
import styled from 'styled-components'
import { LazyLoadImage } from '../Image'
import { ReactComponent as PeopleSvg } from '../../assets/svg/people.svg'
import { ReactComponent as WeiboSvg } from '../../assets/svg/weibo.svg'
import { useTranslation } from 'react-i18next'
import Tooltip from '@material-ui/core/Tooltip'
import classNames from 'classnames'
import { VipSource } from '../../models/class-list'
import { Link } from 'react-router-dom'
import { RoutePath } from '../../routes'
import PeopleSrc from '../../assets/img/people.png'
import { getImagePreviewUrl } from '../../utils'

const Container = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: ${(props: { fontSize?: number }) => `${props.fontSize ?? 12}px`};
  /* line-height: 17px; */
  color: rgba(0, 0, 0, 0.6);
  .error {
    color: #d03a3a;
  }
  .avatar {
    margin-right: 6px;
    max-height: 24px;
    img {
      border-radius: 50%;
      width: 24px;
      height: 24px;
      min-width: 24px;
    }
    svg {
      width: 24px;
      height: 24px;
    }
  }
  .vip {
    width: 15px;
    min-width: 15px;
    height: 15px;
    margin-left: 6px;
    cursor: pointer;
  }
  .issuer {
    white-space: nowrap;
    margin-right: 12px;
  }
  .name {
    color: ${(props: { color?: string }) =>
      `${props.color ?? 'rgba(5, 1, 1, 0.8)'}`};
    font-weight: normal;
    text-overflow: ellipsis;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    &.max {
      flex: 1;
    }
  }
  > a {
    display: flex;
    align-items: center;
    overflow: hidden;
    width: 100%;
  }
`

export interface CreatorProps {
  fontSize?: number
  url?: string
  name?: string
  uuid?: string
  title?: React.ReactNode
  color?: string
  baned?: boolean
  isVip?: boolean
  vipTitle?: string
  vipAlignRight?: boolean
  style?: React.CSSProperties
  showTooltip?: boolean
  vipSource?: VipSource
  showAvatar?: boolean
  replace?: boolean
  useImageFallBack?: boolean
}

export const Creator: React.FC<CreatorProps> = ({
  fontSize,
  url,
  name,
  uuid,
  title,
  color,
  baned = false,
  isVip = false,
  vipTitle,
  vipAlignRight = false,
  style,
  showTooltip = true,
  vipSource,
  showAvatar = true,
  replace = false,
  useImageFallBack,
}) => {
  const { t } = useTranslation('translations')
  const vt = useMemo(() => {
    if (vipSource === VipSource.Nervina) {
      return vipTitle as string
    }
    if (vipTitle) {
      return t('common.vip.weibo', { title: vipTitle })
    }
    return t('common.vip.weibo-no-desc')
  }, [t, vipTitle, vipSource])
  const tooltipPlacement = useMemo(() => {
    if (vipAlignRight) {
      return 'top-end'
    }
    return (name?.length ?? 0) > 25 ? 'top-end' : 'top'
  }, [vipAlignRight, name])
  const creator = (
    <>
      {showAvatar ? (
        <span className="avatar">
          {baned ? (
            <PeopleSvg />
          ) : (
            <LazyLoadImage
              src={getImagePreviewUrl(url, 150)}
              width={24}
              height={24}
              variant="circle"
              backup={
                useImageFallBack ? <img src={PeopleSrc} /> : <PeopleSvg />
              }
            />
          )}
        </span>
      ) : null}
      <span
        className={classNames(['name', { error: baned, max: vipAlignRight }])}
      >
        {baned ? t('common.baned.issuer') : name}
      </span>
      {isVip && !baned ? (
        showTooltip ? (
          <Tooltip
            title={vt}
            placement={tooltipPlacement}
            PopperProps={{ style: { maxWidth: '185px' } }}
          >
            <WeiboSvg className="vip" />
          </Tooltip>
        ) : (
          <WeiboSvg className="vip" />
        )
      ) : null}
    </>
  )
  return (
    <Container fontSize={fontSize} color={color} style={style}>
      {title ?? <span className="issuer">{t('common.creator')}</span>}
      {uuid != null && !baned ? (
        <Link
          onClick={(e) => e.stopPropagation()}
          style={{ textDecoration: 'none' }}
          to={`${RoutePath.Issuer}/${uuid}`}
          replace={replace}
        >
          {creator}
        </Link>
      ) : (
        creator
      )}
    </Container>
  )
}
