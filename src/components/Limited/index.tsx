import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
// import { ReactComponent as StarSvg } from '../../assets/svg/star.svg'
import goldBox from '../../assets/img/gold-box.png'

const Container = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 18px;
    height: 18px;
  }
  span {
    font-size: ${(props: { fontSize?: number }) => `${props.fontSize ?? 12}px`};
    line-height: 17px;
    color: ${(props: { color?: string }) => `${props.color ?? 'black'}`};
    &.unlimit {
      color: rgba(0, 0, 0, 0.5);
    }
  }
`

export interface LimitedProps {
  count: string
  fontSize?: number
  bold?: boolean
  color?: string
}

export const Limited: React.FC<LimitedProps> = ({
  count,
  fontSize,
  bold = false,
  color,
}) => {
  const isUnlimited = count === '0'
  const { t } = useTranslation('translations')
  return (
    <Container fontSize={fontSize} color={color}>
      {isUnlimited ? null : <img src={goldBox} />}
      <span
        className={`${isUnlimited ? 'unlimit' : ''}`}
        style={{
          marginLeft: isUnlimited ? 0 : '8px',
          fontWeight: bold ? 'bold' : 'normal',
        }}
      >
        {isUnlimited
          ? t('common.limit.unlimit')
          : `${t('common.limit.limit')} ${count}`}
      </span>
    </Container>
  )
}
