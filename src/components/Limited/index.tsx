import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
// import { ReactComponent as WeiboSvg } from '../../assets/svg/weibo.svg'
import goldBox from '../../assets/img/gold-box.png'
import { formatCount } from '../../utils'

const Container = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 17px;
    height: 17px;
  }
  span {
    font-size: ${(props: { fontSize?: number }) => `${props.fontSize ?? 12}px`};
    color: ${(props: { color?: string }) => `${props.color ?? 'black'}`};
    &.unlimit {
      color: rgba(0, 0, 0, 0.5);
    }
  }
`

export interface LimitedProps {
  count: string | number
  fontSize?: number
  bold?: boolean
  color?: string
  banned?: boolean
  sn?: number
}

export const Limited: React.FC<LimitedProps> = ({
  count,
  fontSize,
  bold = false,
  color,
  banned = false,
  sn,
}) => {
  const isUnlimited = count === '0' || count === 0
  const { t, i18n } = useTranslation('translations')
  const content = useMemo(() => {
    if (banned) {
      return ''
    }
    const no = sn != null ? `#${sn} / ` : ''
    return (
      no +
      (isUnlimited
        ? t('common.limit.unlimit')
        : `${t('common.limit.limit')} ${formatCount(
            Number(count),
            i18n.language
          )}`)
    )
  }, [t, isUnlimited, banned, count, sn, i18n.language])
  return (
    <Container fontSize={fontSize} color={color}>
      {isUnlimited || banned ? null : <img src={goldBox} />}
      <span
        className={`${isUnlimited ? 'unlimit' : ''}`}
        style={{
          marginLeft: isUnlimited ? 0 : '8px',
          fontWeight: bold ? 'bold' : 'normal',
          whiteSpace: 'nowrap',
        }}
      >
        {content}
      </span>
    </Container>
  )
}
