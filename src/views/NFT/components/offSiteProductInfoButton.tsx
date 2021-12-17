import { Button, Box, Flex, useDisclosure } from '@chakra-ui/react'
import { Drawer } from '@mibao-ui/components'
import { CONTAINER_MAX_WIDTH } from '../../../constants'
import { useInnerSize } from '../../../hooks/useInnerSize'
import { ReactComponent as BackSvg } from '../../../assets/svg/token-class-footer-link-back.svg'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { TokenClass } from '../../../models/class-list'

const BackSvgStyled = styled(BackSvg)`
  position: absolute;
  top: 8px;
  left: 12px;
  cursor: pointer;
  padding: 4px;
  width: 32px;
  height: 32px;
  :hover {
    background-color: rgba(0, 0, 0, 0.06);
    border-radius: 8px;
  }
`

export const OffSiteProductInfoButton: React.FC<{
  info: Required<TokenClass>['off_site_product_info']
}> = ({ info }) => {
  const { t } = useTranslation('translations')
  const { width } = useInnerSize()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex justify="flex-end">
      <Drawer
        placement="bottom"
        isOpen={isOpen}
        onClose={onClose}
        hasCloseBtn
        hasOverlay
        contentProps={{
          w: '100%',
          pt: '60px',
          pb: 'calc(10px + var(--safe-area-inset-bottom))',
          style: {
            left: `calc(50% - calc(${Math.min(
              width,
              CONTAINER_MAX_WIDTH
            )}px / 2))`,
            transform: 'translateX(0px) translateY(-50%) translateZ(0px)',
            maxWidth: `${CONTAINER_MAX_WIDTH}px`,
            borderRadius: '20px 20px 0 0',
          },
        }}
      >
        <BackSvgStyled onClick={onClose} />
        <Box textAlign="center" fontSize="18px">
          {t('nft.external-product.upcoming-visit')}
        </Box>
        <Box bg="#F6F9FC" fontSize="12px" p="12px" my="15px">
          {info.url}
        </Box>
        <Box fontSize="12px" color="primary.600" textAlign="center">
          {t('nft.external-product.not-official-website')}
        </Box>
        <Button
          as="a"
          variant="solid"
          isFullWidth
          colorScheme="primary"
          size="lg"
          mt="30px"
          href={info.url || '#'}
          target="_blank"
          onClick={onClose}
        >
          {t('nft.external-product.go-to-link')}
        </Button>
      </Drawer>
      {info.price ? (
        <Box
          as="span"
          color="primary.600"
          fontSize="12px"
          h="40px"
          lineHeight="40px"
          mr="6px"
          fontWeight="500"
        >
          ¥{info.price}
        </Box>
      ) : null}
      <Button
        colorScheme="primary"
        variant="solid"
        my="auto"
        mr="0"
        fontWeight="normal"
        fontSize="14px"
        onClick={onOpen}
        cursor="pointer"
      >
        {t('nft.external-product.go-to-see')}
      </Button>
    </Flex>
  )
}
