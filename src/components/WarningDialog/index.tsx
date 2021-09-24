import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { ReactComponent as WarningSvg } from '../../assets/svg/warning-dialog.svg'
import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'
import { useWarningModel } from '../../hooks/useWarning'
import { Button } from '../../views/Reedem/Button'

const DialogContainer = styled(Dialog)`
  .MuiPaper-root {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 15px;
    position: relative;
    padding: 24px;
    max-width: 280px;
    min-width: 280px;
    .close {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px solid #e6e8ec;
      position: absolute;
      right: 20px;
      padding: 10px;
      border-radius: 100%;
    }
    .icon {
      text-align: center;
      margin: 36px 0;
    }
    .content {
      margin-bottom: 32px;
      color: #23262f;
      font-size: 16px;
    }
    button {
      margin-top: 8px;
    }
  }
`

const useStyles = makeStyles(() => ({
  paper: { minWidth: '320px', maxWidth: '320px', borderRadius: '20px' },
}))

export interface ActionDialogProps {
  onConfrim?: () => void
  onClose?: () => void
  icon: React.ReactNode
  content: React.ReactNode
  detail?: React.ReactNode
  extra?: React.ReactNode
  dialogTitle?: React.ReactNode
  showCloseIcon?: boolean
  okText?: React.ReactNode
}

export const WarningDialog: React.FC = () => {
  const { t } = useTranslation('translations')
  const style = useStyles()
  const {
    isOpen,
    setIsOpen,
    content,
    isLoading,
    onConfirm,
    onClose,
  } = useWarningModel()
  return (
    <DialogContainer
      open={isOpen}
      classes={{ paper: style.paper }}
      onBackdropClick={() => setIsOpen(false)}
      onClose={() => setIsOpen(false)}
    >
      <div>
        <div className="close" onClick={onClose}>
          <CloseSvg />
        </div>
      </div>
      <div className="icon">
        <WarningSvg />
      </div>
      <div className="content">{content}</div>
      <Button isLoading={isLoading} onClick={onConfirm}>
        {t('common.actions.comfirm')}
      </Button>
      <Button onClick={onClose} cancel>
        {t('common.actions.cancel')}
      </Button>
    </DialogContainer>
  )
}
