import React from 'react'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import styled from 'styled-components'
import { Button } from '../Button'
import { makeStyles } from '@material-ui/core'

const DialogContainer = styled(Dialog)`
  display: flex;
  justify-content: center;
  align-items: center;
  .svg {
    margin-top: 48px;
    margin-bottom: 28px;
    text-align: center;
  }
  .content {
    text-align: center;
    p {
      margin: 0;
    }
    .text {
      font-size: 14px;
    }
    .detail {
      font-size: 12px;
    }
  }
  .comfirm {
    display: flex;
    justify-content: center;
    margin: 32px 0;
  }
`

const useStyles = makeStyles(() => ({
  paper: { minWidth: '320px', maxWidth: '320px' },
}))

export interface ActionDialogProps {
  onConfrim?: () => void
  icon: React.ReactNode
  content: React.ReactNode
  detail?: React.ReactNode
}

export const ActionDialog: React.FC<DialogProps & ActionDialogProps> = (
  props
) => {
  const { onConfrim, icon, content, detail, ...dialogProps } = props
  const style = useStyles()
  return (
    <DialogContainer {...dialogProps} classes={{ paper: style.paper }}>
      <div className="svg">{icon}</div>
      <div className="content">
        <p className="text">{content}</p>
        {detail != null ? <p className="detail">{detail}</p> : null}
      </div>
      <div className="comfirm">
        <Button onClick={onConfrim} type="primary">
          确认
        </Button>
      </div>
    </DialogContainer>
  )
}
