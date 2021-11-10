/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import classNames from 'classnames'
import React from 'react'
import {
  Button as MdButton,
  ButtonProps as MdButtonProps,
} from '@mibao-ui/components'
export interface ButtonProps extends MdButtonProps {
  isLoading?: boolean
  cancel?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  isLoading = false,
  children,
  className,
  disabled,
  cancel,
  ...props
}) => {
  return (
    <MdButton
      {...props}
      className={classNames(className, 'btn', { cancel })}
      isDisabled={disabled}
      isFullWidth
      fontWeight="normal"
      variant="solid"
      colorScheme={cancel ? undefined : 'primary'}
      mx="20px"
    >
      <span className="text">{children}</span>
    </MdButton>
  )
}
