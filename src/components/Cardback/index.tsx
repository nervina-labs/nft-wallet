import React from 'react'
import { Tooltip } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ReactComponent as CardBackSvg } from '../../assets/svg/card-back.svg'

const CardBackContainer = styled.div`
  border-bottom-left-radius: 8px;
  width: 33px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`

export type Placement =
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'left-end'
  | 'left-start'
  | 'left'
  | 'right-end'
  | 'right-start'
  | 'right'
  | 'top-end'
  | 'top-start'
  | 'top'

export interface CardBackProps {
  style?: React.CSSProperties
  tooltipPlacement?: Placement
}

export const CardBack: React.FC<CardBackProps> = ({
  style,
  tooltipPlacement,
}) => {
  const [t] = useTranslation('translations')
  const title = t('common.card-back')
  return (
    <Tooltip placement={tooltipPlacement ?? 'top-end'} title={title}>
      <CardBackContainer style={style}>
        <CardBackSvg />
      </CardBackContainer>
    </Tooltip>
  )
}
