import { AspectRatio, Box, Image } from '@mibao-ui/components'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { InfiniteList } from '../../../components/InfiniteList'
import { useAPI } from '../../../hooks/useAccount'
import { Query, ClassSortType as SortType } from '../../../models'
import { isSupportWebp } from '../../../utils'
import FALLBACK from '../../../assets/svg/fallback.svg'
import { useRouteQuerySearch } from '../../../hooks/useRouteQuery'
import { useHistory } from 'react-router-dom'

export const Lite: React.FC = () => {
  const { t } = useTranslation('translations')
  const api = useAPI()
  const [currentTag] = useRouteQuerySearch<string>('tag', 'all')
  const [sort] = useRouteQuerySearch<SortType>('sort', SortType.OnSale)
  const queryFn = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = await api.getClassListByTagId(
        currentTag,
        pageParam,
        sort
      )
      return data
    },
    [api, currentTag, sort]
  )
  const { push } = useHistory()

  return (
    <Box mt="25px" px="20px">
      <InfiniteList
        enableQuery
        queryFn={queryFn}
        queryKey={[Query.Explore, currentTag, sort]}
        emptyElement={null}
        noMoreElement={t('common.actions.pull-to-down')}
        calcDataLength={(data) =>
          data?.pages.reduce(
            (acc, token) => token.class_list.length + acc,
            0
          ) ?? 0
        }
        columnCount={2}
        renderItems={(group, i) => {
          return group.class_list.map((token, j: number) => (
            <AspectRatio
              key={`${i}-${j}`}
              ratio={i === 0 && j === 0 ? 1 : 9 / 12}
              mb="10px"
              cursor="pointer"
              onClick={() => push(`/class/${token.uuid}`)}
            >
              <Image
                src={token.bg_image_url === null ? '' : token.bg_image_url}
                width="100%"
                height="100%"
                rounded="20px"
                resizeScale={300}
                webp={isSupportWebp()}
                fallbackSrc={FALLBACK}
                customizedSize={{
                  fixed: 'large',
                }}
              />
            </AspectRatio>
          ))
        }}
      />
    </Box>
  )
}
