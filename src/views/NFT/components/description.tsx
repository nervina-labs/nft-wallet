import { Box } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export const Description: React.FC<{
  description?: string
}> = ({ description }) => {
  const { t } = useTranslation('translations')
  return (
    <Box
      fontSize="14px"
      color="#777E90"
      userSelect="text"
      whiteSpace="pre-wrap"
    >
      {description || t('nft.no-desc')}
    </Box>
  )
}
