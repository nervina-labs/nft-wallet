import EmptyPath from '../../../assets/img/issuer-empty.png'
import { Box, Image } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export const Empty: React.FC<{ description?: string }> = ({ description }) => {
  const { t } = useTranslation('translations')
  return (
    <Box>
      <Image src={EmptyPath} w="auto" h="200px" mx="auto" mt="40px" />
      <Box color="#777E90" fontSize="12px" textAlign="center">
        {description || t('issuer.empty')}
      </Box>
    </Box>
  )
}
