import React from 'react'
import { useErrorToastModel } from '../../hooks/useErrorToast'
import { ActionDialog } from '../ActionDialog'
import { ReactComponent as FailSvg } from '../../assets/svg/fail.svg'

export const ErrorToastDialog: React.FC = () => {
  const { content, isOpen, setIsOpen } = useErrorToastModel()
  return (
    <ActionDialog
      icon={<FailSvg />}
      content={content}
      open={isOpen}
      onConfrim={() => setIsOpen(false)}
      onBackdropClick={() => setIsOpen(false)}
    />
  )
}
