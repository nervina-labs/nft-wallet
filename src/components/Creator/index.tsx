import React, { useMemo } from 'react'
import styled from 'styled-components'
import { LazyLoadImage } from '../Image'
import { ReactComponent as PeopleSvg } from '../../assets/svg/people.svg'
import { ReactComponent as WeiboSvg } from '../../assets/svg/weibo.svg'
import { NFT_EXPLORER_URL } from '../../constants'
import { useTranslation } from 'react-i18next'
import Tooltip from '@material-ui/core/Tooltip'
import classNames from 'classnames'

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
    white-space: nowrap;
    overflow: hidden;
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
  url: string
  name: string
  uuid?: string
  title?: React.ReactNode
  color?: string
  baned?: boolean
  isVip?: boolean
  vipTitle?: string
  vipAlignRight?: boolean
  style?: React.CSSProperties
  showTooltip?: boolean
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
}) => {
  const { t } = useTranslation('translations')
  const vt = useMemo(() => {
    if (vipTitle) {
      return t('common.vip.weibo', { title: vipTitle })
    }
    return t('common.vip.weibo-no-desc')
  }, [t, vipTitle])
  const tooltipPlacement = useMemo(() => {
    if (vipAlignRight) {
      return 'top-end'
    }
    return name.length > 25 ? 'top-end' : 'top'
  }, [vipAlignRight, name])
  const creator = (
    <>
      <span className="avatar">
        {baned ? (
          <PeopleSvg />
        ) : (
          <LazyLoadImage
            src={url}
            width={24}
            height={24}
            variant="circle"
            backup={<PeopleSvg />}
          />
        )}
      </span>
      <span
        className={classNames(['name', { error: baned, max: vipAlignRight }])}
      >
        {baned ? t('common.baned.issuer') : name}
      </span>
      {isVip ? (
        showTooltip ? (
          <Tooltip title={vt} placement={tooltipPlacement}>
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
      {uuid != null ? (
        <a
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          style={{ textDecoration: 'none' }}
          rel="noopener noreferrer"
          href={`${NFT_EXPLORER_URL}/issuer/tokens/${uuid}`}
        >
          {creator}
        </a>
      ) : (
        creator
      )}
    </Container>
  )
}
