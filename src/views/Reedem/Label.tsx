import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { RedeemType } from '../../models/redeem'

export interface LabelProps {
  type: RedeemType
}

const Container = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.color};
  border: 1px solid;
  border-color: ${(props) => props.color};
  width: 58px;
  height: 17px;
  font-size: 12px;
`

export const Label: React.FC<LabelProps> = ({ type }) => {
  const [t] = useTranslation('translations')
  const text = t(`exchange.type.${type}`)
  const color = useMemo(() => {
    if (type === RedeemType.NFT) {
      return '#43b89a'
    } else if (type === RedeemType.Blind) {
      return '#00aaff'
    }
    return '#6764f2'
  }, [type])
  return <Container color={color}>{text}</Container>
}
