import React from 'react'
import { useToastModel } from '../../hooks/useToast'
import { ActionDialog } from '../ActionDialog'

export const ConfirmToast: React.FC = () => {
  const { toastConfig } = useToastModel()
  return (
    <ActionDialog
      icon={null}
      dialogTitle={toastConfig.title}
      content={toastConfig.content}
      open={toastConfig.show}
      okText={toastConfig.okText}
      showCloseIcon={toastConfig.showCloseIcon}
      onConfrim={toastConfig.onConfirm}
      onBackdropClick={toastConfig.onBackdropClick}
    />
  )
}
