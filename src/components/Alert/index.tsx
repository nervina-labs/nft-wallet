import React from 'react'
import { Alert as RawAlert, AlertIcon, AlertProps } from '@chakra-ui/react'

export const Alert: React.FC<AlertProps> = ({
  status = 'error',
  children,
  ...rest
}) => {
  return (
    <RawAlert status={status} fontSize="12px" borderRadius="8px" {...rest}>
      <AlertIcon />
      {children}
    </RawAlert>
  )
}
