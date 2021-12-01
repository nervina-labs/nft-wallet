import {
  Box,
  Button,
  Flex,
  Issuer,
  NftImage,
  VStack,
} from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { isSupportWebp } from '../../../utils'
import { useSearchAPI } from '../hooks/useSearchAPI'
import { useType } from '../hooks/useType'
import { LinkContainer } from './linkContainer'
import { Loading } from './loading'
import { NoData } from './noData'
import { Title } from './title'

export const NoType: React.FC<{ keyword: string }> = ({ keyword }) => {
  const { data, isLoading } = useSearchAPI(keyword)
  const { t } = useTranslation('translations')
  const [, setType] = useType()
  const isEmpty =
    !isLoading &&
    !data?.issuer_list.length &&
    !data?.token_class_list.length &&
    keyword

  return (
    <>
      {isLoading ? <Loading /> : null}
      {isEmpty ? <NoData /> : null}

      {data?.issuer_list && data.issuer_list.length > 0 ? (
        <>
          <Title>{t('search.issuer')}</Title>
          <VStack spacing="20px">
            {data?.issuer_list.map((issuer, i) => (
              <LinkContainer to={`/issuer/${issuer.uuid}`}>
                <Issuer
                  key={i}
                  name={issuer.name}
                  src={issuer.avatar_url === null ? '' : issuer.avatar_url}
                  verifiedTitle={issuer.verified_info?.verified_title}
                  isVerified={issuer.verified_info?.is_verified}
                  webp={isSupportWebp()}
                  resizeScale={100}
                  size="48px"
                  containerProps={{
                    w: '100%',
                  }}
                />
              </LinkContainer>
            ))}
          </VStack>
          <Button
            as="a"
            variant="link"
            w="100%"
            fontSize="12px"
            color="primary.500"
            mt="25px"
            textAlign="center"
            textDecoration="underline"
            onClick={() => setType('issuer')}
          >
            {t('search.more-issuer')}
          </Button>
        </>
      ) : null}

      {data?.token_class_list && data.token_class_list.length > 0 ? (
        <>
          <Title mt="32px">{t('search.token-class')}</Title>
          <VStack spacing="20px">
            {data?.token_class_list?.map((tokenClass, i) => (
              <LinkContainer to={`/class/${tokenClass.uuid}`}>
                <Flex key={i} w="full" alignItems="center">
                  <NftImage src={tokenClass.bg_image_url} w="48px" />
                  <Box fontSize="14px" ml="16px">
                    {tokenClass.name}
                  </Box>
                </Flex>
              </LinkContainer>
            ))}
          </VStack>
          <Button
            as="a"
            variant="link"
            w="100%"
            fontSize="12px"
            color="primary.500"
            mt="25px"
            textAlign="center"
            textDecoration="underline"
            onClick={() => setType('token_class')}
          >
            {t('search.more-token-class')}
          </Button>
        </>
      ) : null}
    </>
  )
}
