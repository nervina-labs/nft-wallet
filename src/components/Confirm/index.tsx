import React from 'react'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { useWalletModel } from '../../hooks/useWallet'

const DialogContainer = styled(Dialog)`
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
  footer {
    display: flex;
    height: 56px;
    border-top: 1px solid #e5e5e5;
    cursor: pointer;
    .close {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      font-size: 15px;
      border-right: 1px solid #e5e5e5;
    }
    .comfirm {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
  }
`

const useStyles = makeStyles(() => ({
  paper: {
    minWidth: '320px',
    maxWidth: '320px',
    borderRadius: '20px',
    height: '180px',
  },
}))

export interface ActionDialogProps {
  onConfrim?: () => void
  onClose?: () => void
  children?: React.ReactNode
}

export const Comfirm: React.FC<DialogProps & ActionDialogProps> = (
  dialogProps
) => {
  const style = useStyles()
  const { t } = useTranslation('translations')
  const {
    confirmContent,
    onDialogClose,
    onDialogConfirm,
    showConfirmDialog,
  } = useWalletModel()
  return (
    <DialogContainer
      {...dialogProps}
      classes={{ paper: style.paper }}
      open={showConfirmDialog}
    >
      <section className="content">{confirmContent}</section>
      <footer>
        <div className="close" onClick={onDialogClose}>
          {t('profile.cancel')}
        </div>
        <div className="comfirm" onClick={onDialogConfirm}>
          {t('profile.comfirm')}
        </div>
      </footer>
    </DialogContainer>
  )
}
