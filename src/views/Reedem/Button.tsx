/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {
  Button as MdButton,
  ButtonProps as MdButtonProps,
  CircularProgress,
} from '@material-ui/core'
import classNames from 'classnames'
import React from 'react'
import styled from 'styled-components'

const ButtonContainer = styled(MdButton)`
  &.btn {
    border: 1px solid #d2d2d2;
    border-radius: 25px;
    width: 280px;
    background: rgb(43, 69, 78);
    color: white;
    &.cancel {
      border: 1px solid rgb(226, 226, 226);
      background: white;
      color: #23262f;
      &:hover {
        background: white;
      }
    }
    .text {
      margin-right: 8px;
    }
    &:hover {
      background: rgb(43, 69, 78);
    }
    svg {
      g {
        fill: white;
      }
    }
  }

  &:disabled {
    color: rgb(214, 214, 214) !important;
    background-color: #999999 !important;
    cursor: not-allowed;
    pointer-events: none;

    svg {
      g {
        fill: rgb(214, 214, 214);
      }
    }
  }
  &.MuiButton-text {
    padding-top: 12px;
    padding-bottom: 12px;
    text-transform: none;
  }
`

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
    <ButtonContainer
      {...props}
      className={classNames(className, 'btn', { cancel })}
      disabled={disabled || isLoading}
    >
      <span className="text">{children}</span>
      {isLoading ? <CircularProgress className="loading" size="1em" /> : null}
    </ButtonContainer>
  )
}
