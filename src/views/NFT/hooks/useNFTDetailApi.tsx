import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useAccountStatus, useAPI } from '../../../hooks/useAccount'
import { useGetAndSetAuth } from '../../../hooks/useProfile'
import { useWechatShare } from '../../../hooks/useWechat'
import { Query } from '../../../models'

export interface RouteParamsNftId {
  id: string
}
export interface RouteParamsNftWhitClassIdTokenId {
  class_id: string
  token_id: string
}

export type RouteParams = RouteParamsNftId | RouteParamsNftWhitClassIdTokenId

export function useNFTDetailApi(
  uuid: string,
  options?: {
    isClass?: boolean
    tid?: string
  }
) {
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const { isLogined } = useAccountStatus()
  const wechatShare = useWechatShare()
  const { t } = useTranslation('translations')
  const { data: detail, failureCount, isLoading, refetch } = useQuery(
    [Query.NFTDetail, uuid, api, isLogined, getAuth],
    async () => {
      const auth = isLogined ? await getAuth() : undefined
      const hasTid = typeof options?.tid !== 'undefined'
      if (options?.isClass && !hasTid) {
        const { data } = await api.getTokenClass(uuid, auth)
        return data
      }
      const { data } =
        hasTid && options?.tid
          ? await api.getNFTDetailByClassUuidAndTid(uuid, options.tid, { auth })
          : await api.getNFTDetail(uuid, auth)
      return data
    },
    {
      enabled: Boolean(uuid),
      onSuccess(d) {
        wechatShare({
          title: d?.name || '',
          desc: t('common.share.wx.nft.desc'),
          link: location.href,
          imgUrl: d?.thumbnail_url,
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
