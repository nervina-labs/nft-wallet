import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ReactComponent as StarSvg } from '../../assets/svg/star.svg'

const Container = styled.div`
  display: flex;
  align-items: center;
  span {
    font-weight: 600;
    font-size: ${(props: { fontSize?: number }) => `${props.fontSize ?? 12}px`};
    line-height: 17px;
    &.unlimit {
      color: rgba(0, 0, 0, 0.5);
    }
  }
`

export interface LimitedProps {
  count: string
  fontSize?: number
}

export const Limited: React.FC<LimitedProps> = ({ count, fontSize }) => {
  const isUnlimited = count === '0'
  const { t } = useTranslation('translations')
  return (
    <Container fontSize={fontSize}>
      {isUnlimited ? null : <StarSvg />}
      <span
        className={`${isUnlimited ? 'unlimit' : ''}`}
        style={{ marginLeft: isUnlimited ? 0 : '4px' }}
      >
        {isUnlimited
          ? t('common.limit.unlimit')
          : `${t('common.limit.limit')} ${count}`}
      </span>
    </Container>
  )
}
