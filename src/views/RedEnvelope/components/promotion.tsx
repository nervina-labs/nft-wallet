import { Box, Button, Flex } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { RoutePath } from '../../../routes'
import { removeCurrentUrlOrigin } from '../../../utils'

const LinkStyled = styled(Link)`
  display: block;
  background-color: #f9e0b7;
  min-width: 150px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 8px;
  padding: 0 20px;
  font-weight: bold;
  :active {
    background-color: #dac4a0;
    transition: 0s;
  }
`

export const Promotion: React.FC<{
  copy: string
  link: string
}> = ({ copy, link }) => {
  const { t } = useTranslation('translations')
  const promotionLink = useMemo(
    () => (link ? removeCurrentUrlOrigin(link) : undefined),
    [link]
  )

  return (
    <Flex direction="column" h="114px">
      <Box color="#F9E0B7" fontSize="16px" mb="10px" mt="auto" px="20px">
        {copy || t('red-envelope.default-promotion-copy')}
      </Box>
      {promotionLink === link ? (
        <Button
          as="a"
          variant="solid"
          bg="#F9E0B7"
          minW="150px"
          _hover={{
            bg: '#F9E0B7',
          }}
          _active={{
            bg: '#dac4a0',
            transition: '0s',
          }}
          href={promotionLink}
          target="_blank"
        >
          {t('red-envelope.promotion-link')}
        </Button>
      ) : (
        <LinkStyled to={promotionLink || RoutePath.NFTs}>
          {t('red-envelope.promotion-link')}
        </LinkStyled>
      )}
    </Flex>
  )
}
