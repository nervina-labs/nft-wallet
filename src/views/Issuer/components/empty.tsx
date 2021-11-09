import SaleEmptyPath from '../../../assets/img/issuer-sale-empty.png'
import EmptyPath from '../../../assets/img/issuer-empty.png'
import { Box, Image } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { ProductState } from '../../../models'

export const Empty: React.FC<{
  type?: ProductState
}> = ({ type }) => {
  const { t } = useTranslation('translations')
  return (
    <Box>
      <Image
        src={type === 'on_sale' ? SaleEmptyPath : EmptyPath}
        w="auto"
        h="200px"
        mx="auto"
        mt="40px"
      />
      <Box color="#777E90" fontSize="12px" textAlign="center">
        {type === 'on_sale' ? t('issuer.sale-empty') : t('issuer.empty')}
      </Box>
    </Box>
  )
}
