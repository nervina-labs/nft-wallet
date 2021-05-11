import React from 'react'
import styled from 'styled-components'
import Dialog from '@material-ui/core/Dialog'
import { Button } from '../../components/Button'
import { makeStyles } from '@material-ui/core'
import { Copyzone } from '../../components/Copyzone'
import { useTranslation } from 'react-i18next'

const DialogContainer = styled(Dialog)`
  display: flex;
  justify-content: center;
  align-items: center;
  .title {
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    margin: 32px 32px 16px 32px;
    text-align: center;
  }
  .action {
    display: flex;
    justify-content: center;
    margin: 32px;
  }
`

const useStyles = makeStyles(() => ({
  paper: { minWidth: '320px', maxWidth: '320px' },
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

  return (
    <DialogContainer
      open={isDialogOpen}
      classes={{ paper: style.paper }}
      onBackdropClick={closeDialog}
    >
      <div className="title">{t('common.share.copy')}</div>
      <Copyzone text={copyText} displayText={displayText} />
      <div className="action">
        <Button onClick={closeDialog}>{t('common.share.close')}</Button>
      </div>
    </DialogContainer>
  )
}
