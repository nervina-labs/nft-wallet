import { useTranslation } from 'react-i18next'
import { useLogout } from './useAccount'
import { useConfirmDialog } from './useConfirmDialog'

export const useUnipassV2Dialog = () => {
  const [t] = useTranslation('translations')
  const confirmDialog = useConfirmDialog()
  const logout = useLogout()
  return (): void => {
    confirmDialog({
      type: 'error',
      title: t('common.unipass-v2-error'),
      okText: t('common.relogin'),
      onConfirm() {
        logout()
      },
    })
  }
}
