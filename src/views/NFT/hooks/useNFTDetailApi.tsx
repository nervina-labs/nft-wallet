import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useAccountStatus, useAPI } from '../../../hooks/useAccount'
import { useGetAndSetAuth } from '../../../hooks/useProfile'
import { useWechatShare } from '../../../hooks/useWechat'
import { Query } from '../../../models'
import { isTokenClass } from '../../../models/class-list'

export function useNFTDetailApi(
  uuid: string,
  options?: {
    isClass?: boolean
  }
) {
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const { isLogined } = useAccountStatus()
  const wechatShare = useWechatShare()
  const { t } = useTranslation('translations')
  const { data: detail, failureCount, isLoading, refetch } = useQuery(
    [Query.NFTDetail, uuid, api, isLogined],
    async () => {
      const auth = isLogined ? await getAuth() : undefined
      const { data } = options?.isClass
        ? await api.getTokenClass(uuid, auth)
        : await api.getNFTDetail(uuid, auth)
      return data
    },
    {
      enabled: Boolean(uuid),
      onSuccess(d) {
        wechatShare({
          title: d.name,
          desc: t('common.share.wx.nft.desc'),
          link: `${location.origin}/class/${
            isTokenClass(d) ? uuid : d.class_uuid
          }`,
        })
      },
    }
  )

  return {
    detail,
    failureCount,
    isLoading,
    refetch,
  }
}
