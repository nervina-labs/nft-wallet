import {
  Box,
  Button,
  Flex,
  Issuer,
  NftImage,
  VStack,
} from '@mibao-ui/components'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchType } from '../../../models'
import { isSupportWebp } from '../../../utils'
import { useNoTypeSearchAPI } from '../hooks/useSearchAPI'
import { useType } from '../hooks/useType'
import { LinkContainer } from './linkContainer'
import { Loading } from './loading'
import { NoData } from './noData'
import { Title } from './title'

export const NoType: React.FC<{ keyword: string }> = ({ keyword }) => {
  const { data, isLoading } = useNoTypeSearchAPI(keyword)
  const { t } = useTranslation('translations')
  const [, setType] = useType()
  const isEmpty =
    !isLoading &&
    !data?.issuersData.issuers.length &&
    !data?.tokenClassesData.token_classes.length &&
    keyword
  const hasIssuers =
    data?.issuersData.issuers && data?.issuersData.issuers.length > 0
  const hasTokenClasses =
    data?.tokenClassesData.token_classes &&
    data?.tokenClassesData.token_classes.length > 0
  const goToSearchIssuer = useCallback(() => {
    setType(SearchType.Issuer)
  }, [setType])
  const goToSearchTokenClass = useCallback(() => {
    setType(SearchType.TokenClass)
  }, [setType])

  return (
    <>
      {isLoading ? <Loading /> : null}
      {isEmpty ? <NoData /> : null}

      {hasIssuers ? (
        <>
          <Title>{t('search.issuer')}</Title>
          <VStack>
            {data?.issuersData.issuers.map((issuer, i) => (
              <LinkContainer to={`/issuer/${issuer.uuid}`} key={i}>
                <Issuer
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
            onClick={goToSearchIssuer}
          >
            {t('search.more-issuer')}
          </Button>
        </>
      ) : null}

      {hasTokenClasses ? (
        <>
          <Title mt="32px">{t('search.token-class')}</Title>
          <VStack spacing="20px">
            {data?.tokenClassesData.token_classes?.map((tokenClass, i) => (
              <LinkContainer to={`/class/${tokenClass.uuid}`} key={i}>
                <Flex w="full" alignItems="center">
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
            onClick={goToSearchTokenClass}
          >
            {t('search.more-token-class')}
          </Button>
        </>
      ) : null}
    </>
  )
}
