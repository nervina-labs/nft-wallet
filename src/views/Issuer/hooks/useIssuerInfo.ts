import { useQuery } from 'react-query'
import { Query } from '../../../models'
import { useAPI } from '../../../hooks/useAccount'
import { useHistory } from 'react-router-dom'
import { useWechatShare } from '../../../hooks/useWechat'
import { useTranslation } from 'react-i18next'
import { RoutePath } from '../../../routes'

export function useIssuerInfo(
  issuerId: string,
  options?: {
    errorRedirection?: boolean
  }
) {
  const api = useAPI()
  const { replace } = useHistory()
  const wechatShare = useWechatShare()
  const [t] = useTranslation('translations')
  const { data, isLoading, refetch, error, failureCount } = useQuery(
    [Query.Issuers, api, issuerId],
    async () => {
      const { data } = await api.getIssuerInfo(issuerId)
      return data
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(data) {
        wechatShare({
          title: t('common.share.wx.issuer.title', { name: data.name }),
          desc: t('common.share.wx.issuer.desc'),
          link: `${location.origin}${RoutePath.Issuer}/${issuerId}`,
        })
      },
    }
  )
  if (options?.errorRedirection !== false && error) {
    replace('/404')
  }

  return {
    data,
    isLoading,
    refetch,
    error,
    failureCount,
  }
}
