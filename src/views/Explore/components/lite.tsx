import { AspectRatio, Box, Image } from '@mibao-ui/components'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { InfiniteList } from '../../../components/InfiniteList'
import { useAPI } from '../../../hooks/useAccount'
import { useProfile } from '../../../hooks/useProfile'
import { ClassSortType } from '../../../models'
import { Query } from '../../../models/query'
import { isSupportWebp } from '../../../utils'
import FALLBACK from '../../../assets/svg/fallback.svg'

const uuid = 'all'
const sortType = ClassSortType.Recommend

export const Lite: React.FC = () => {
  const { t } = useTranslation('translations')
  const api = useAPI()
  const queryFn = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = await api.getClassListByTagId(uuid, pageParam, sortType)
      return data
    },
    [api]
  )
  const { isAuthenticated } = useProfile()

  return (
    <Box mt="25px" px="20px">
      <InfiniteList
        enableQuery
        queryFn={queryFn}
        queryKey={[Query.Explore + 'all' + 'recommended', api, isAuthenticated]}
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
            >
              <Image
                src={token.bg_image_url === null ? '' : token.bg_image_url}
                width="100%"
                height="100%"
                rounded="20px"
                resizeScale={300}
                webp={isSupportWebp()}
                fallbackSrc={FALLBACK}
              />
            </AspectRatio>
          ))
        }}
      />
    </Box>
  )
}
