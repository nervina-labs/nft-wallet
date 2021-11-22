import { Box } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { RedeemType } from '../../models/redeem'

export interface LabelProps {
  type: RedeemType
}

export const RedeemLabel: React.FC<LabelProps> = ({ type }) => {
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
  return (
    <Box
      as="span"
      rounded="3px"
      bg={color}
      minW="58px"
      lineHeight="18px"
      textAlign="center"
      fontSize="12px"
      color="white"
    >
      {text}
    </Box>
  )
}
