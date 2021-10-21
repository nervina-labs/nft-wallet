import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { useSnackbarModel } from '../../hooks/useSnackbar'

const Alert: React.FC<AlertProps> = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

export const GlobalSnackbar: React.FC = () => {
  const { isShow, setIsShow, msg } = useSnackbarModel()
  return (
    <Snackbar
      open={isShow}
      autoHideDuration={1500}
      onClose={() => setIsShow(false)}
      style={{
        bottom: `${window.innerHeight / 2 + 16}px`,
      }}
    >
      <Alert
        style={{
          borderRadius: '16px',
          background: 'rgba(51, 51, 51, 0.692657)',
          padding: '0px 40px',
        }}
        icon={false}
        severity="success"
      >
        {msg}
      </Alert>
    </Snackbar>
  )
}
