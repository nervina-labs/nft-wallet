import React, { useRef } from 'react'
import styled from 'styled-components'
import Dialog from '@material-ui/core/Dialog'
import { Button } from '../../components/Button'
import { makeStyles } from '@material-ui/core'
import { Copyzone } from '../../components/Copyzone'
import { useTranslation } from 'react-i18next'
import SharePng from '../../assets/img/share.png'

const DialogContainer = styled(Dialog)`
  img {
    width: 60px;
  }
  .content {
    margin: 0;
    margin-top: 12px;
    font-size: 14px;
    line-height: 16px;
    color: #333;
    font-weight: bold;
    word-break: break-all;
    cursor: pointer;
  }
  .action {
    margin-top: 30px;
    margin-bottom: 20px;
  }
`

const useStyles = makeStyles(() => ({
  paper: {
    minWidth: '280px',
    maxWidth: '280px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 28px',
  },
}))

export interface ShareProps {
  isDialogOpen: boolean
  closeDialog: () => void
  displayText: string
  copyText: string
}

export const Share: React.FC<ShareProps> = ({
  isDialogOpen,
  closeDialog,
  displayText,
  copyText,
}) => {
  const style = useStyles()
  const { t } = useTranslation('translations')
  const copyzoneRef = useRef<Copyzone>(null)

  return (
    <DialogContainer
      open={isDialogOpen}
      classes={{ paper: style.paper }}
      onBackdropClick={closeDialog}
      disableScrollLock={window.innerWidth >= 500}
    >
      <img src={SharePng} alt={t('common.share.copy')} />
      <div className="content" onClick={() => copyzoneRef?.current?.onCopy?.()}>
        {copyText}
      </div>
      <Copyzone
        ref={copyzoneRef}
        text={copyText}
        displayText={t('common.share.copy')}
      />
      <div className="action">
        <Button type="primary" onClick={closeDialog}>
          {t('common.share.close')}
        </Button>
      </div>
    </DialogContainer>
  )
}
