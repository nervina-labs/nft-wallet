import { Text } from '@mibao-ui/components'
import { useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { NFTDetail } from '../models'
import { useAPI } from './useAccount'
import { useConfirmDialog } from './useConfirmDialog'
import { useGetAndSetAuth } from './useProfile'

export const useIsCotaCellReady = () => {
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const [isDetecting, setIsDecting] = useState(false)
  const confirmDialog = useConfirmDialog()
  const [t] = useTranslation('translations')
  const detectIsReady = useCallback(
    async (nft: NFTDetail) => {
      if (nft.script_type === 'm_nft') {
        return true
      }
      setIsDecting(true)
      try {
        const auth = await getAuth()
        const {
          data: { human_state: state },
        } = await api.isCotaCellReady(auth)
        switch (state) {
          case 'idle':
            return true
          case 'not_on_chain':
            confirmDialog({
              type: 'warning',
              title: (
                <Text whiteSpace="pre-line">
                  <Trans
                    ns="translations"
                    i18nKey="transfer.error.cota-not-ready"
                    t={t}
                    components={{
                      b: (
                        <span
                          style={{
                            color: '#FF8201',
                          }}
                        />
                      ),
                    }}
                  />
                </Text>
              ),
              okText: t('transfer.error.cota-not-ready-ok'),
            })
            break
          case 'occupied':
            confirmDialog({
              type: 'warning',
              title: t('transfer.error.continuous-transfer'),
            })
            break
          default:
            break
        }
        return false
      } catch (error: any) {
        confirmDialog({
          type: 'warning',
          title: t('transfer.error.cota-status', {
            code: error?.response?.data?.code ?? error?.response?.data?.message,
          }),
        })
        return false
      } finally {
        setIsDecting(false)
      }
    },
    [api, getAuth, t, confirmDialog]
  )

  return {
    isDetecting,
    detectIsReady,
  }
}
