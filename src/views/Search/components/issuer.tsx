import { useTranslation } from 'react-i18next'
import { InfiniteList } from '../../../components/InfiniteList'
import { Query } from '../../../models'
import { NoData } from './noData'
import { Issuer as AvatarWithName } from '@mibao-ui/components'
import { isSupportWebp } from '../../../utils'
import { Loading } from './loading'
import { LinkContainer } from './linkContainer'
import { useSearchAPICallback } from '../hooks/useSearchAPI'

export const Issuer: React.FC<{ keyword: string }> = ({ keyword }) => {
  const { t } = useTranslation('translations')
  const queryFn = useSearchAPICallback(keyword, { type: 'issuer' })

  return (
    <InfiniteList
      enableQuery={!!keyword}
      queryFn={queryFn}
      queryKey={[Query.Issuers, keyword]}
      emptyElement={keyword ? <NoData /> : ''}
      loader={<Loading />}
      noMoreElement={t('common.actions.pull-to-down')}
      calcDataLength={(data) =>
        data?.pages.reduce(
          (acc, token) => token?.issuer_list?.length + acc,
          0
        ) ?? 0
      }
      columnCount={2}
      renderItems={(group, i) => {
        return group?.issuer_list?.map((issuer, j: number) => (
          <LinkContainer to={`/issuer/${issuer.uuid}`}>
            <AvatarWithName
              key={`${i}-${j}`}
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
              mb="20px"
            />
          </LinkContainer>
        ))
      }}
    />
  )
}
