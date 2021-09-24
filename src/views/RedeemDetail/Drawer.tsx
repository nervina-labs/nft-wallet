import React from 'react'
import { DrawerConfig, DrawerConfigProps } from '../Profile/DrawerConfig'

export const RedeemDrawer: React.FC<DrawerConfigProps> = ({
  children,
  ...props
}) => {
  return (
    <DrawerConfig {...props} showSave={false}>
      {children}
    </DrawerConfig>
  )
}
