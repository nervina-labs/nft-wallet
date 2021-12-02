import { Box, Button } from '@mibao-ui/components'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchType } from '../../../models'
import { useNoTypeSearchAPI } from '../hooks/useSearchAPI'
import { useType } from '../hooks/useType'
import { IssuerItem, TokenClassItem } from './item'
import { Loading } from './loading'
import { NoData } from './noData'
import { Title } from './title'

export const NoType: React.FC<{ keyword: string }> = ({ keyword }) => {
  const { data, isLoading } = useNoTypeSearchAPI(keyword)
  const { t } = useTranslation('translations')
  const [, setType] = useType()
  const goToSearchIssuer = useCallback(() => {
    setType(SearchType.Issuer)
  }, [setType])
  const goToSearchTokenClass = useCallback(() => {
    setType(SearchType.TokenClass)
  }, [setType])
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

  return (
    <>
      {isLoading ? <Loading /> : null}
      {isEmpty ? <NoData /> : null}

      {hasIssuers ? (
        <>
          <Title>{t('search.issuer')}</Title>
          <Box>
            {data?.issuersData.issuers.map((issuer, i) => (
              <IssuerItem key={i} issuer={issuer} />
            ))}
          </Box>
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
          <Box>
            {data?.tokenClassesData.token_classes?.map((tokenClass, i) => (
              <TokenClassItem tokenClass={tokenClass} key={i} />
            ))}
          </Box>
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
