import { Box, VStack } from '@chakra-ui/react'
import { ReactComponent as NoDataImageSvg } from '../../../assets/svg/search-no-data.svg'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'

const StyledNoDataImageSvg = styled(NoDataImageSvg)`
  width: 100%;
  max-width: 100px;
  height: auto;
`

export const NoData: React.FC = () => {
  const { t } = useTranslation('translations')
  return (
    <VStack mt="100px">
      <StyledNoDataImageSvg />
      <Box fontSize="12px" color="#777E90">
        {t('search.no-data')}
      </Box>
    </VStack>
  )
}
