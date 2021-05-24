import React from 'react'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import styled from 'styled-components'
import { Button } from '../Button'
import { makeStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'

const DialogContainer = styled(Dialog)`
  display: flex;
  justify-content: center;
  align-items: center;
  .close {
    display: flex;
    width: 100%;
    span {
      flex: 1;
    }
    svg {
      margin-left: auto;
      margin-right: 15px;
      margin-top: 15px;
      cursor: pointer;
    }
  }
  .svg {
    text-align: center;
    img {
      width: 100px;
    }
  }
  .content {
    text-align: center;
    p {
      margin: 0;
      margin-top: 10px;
    }
    .text {
      margin-top: 10px;
      font-size: 12px;
      color: #8d8989;
    }
    .detail {
      font-size: 12px;
    }
  }
  .comfirm {
    display: flex;
    justify-content: center;
    margin-top: 32px;
    margin-bottom: 22px;
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
}

export const ActionDialog: React.FC<DialogProps & ActionDialogProps> = (
  props
) => {
  const {
    onConfrim,
    icon,
    content,
    detail,
    onClose,
    extra,
    ...dialogProps
  } = props
  const style = useStyles()
  const { t } = useTranslation('translations')
  return (
    <DialogContainer {...dialogProps} classes={{ paper: style.paper }}>
      <div className="close">
        <span></span>
        <CloseSvg onClick={onClose ?? onConfrim} />
      </div>
      <div className="svg">{icon}</div>
      <div className="content">
        {extra != null ? extra : null}
        <p className="text">{content}</p>
        {detail != null ? <p className="detail">{detail}</p> : null}
      </div>
      <div className="comfirm">
        <Button onClick={onConfrim} type="primary">
          {t('common.actions.comfirm')}
        </Button>
      </div>
    </DialogContainer>
  )
}
