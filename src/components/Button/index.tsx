import { CircularProgress } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

export interface ButtonProps {
  isLoading?: boolean
  type?: 'default' | 'primary' | 'black'
  onClick?: () => void
  disbaled?: boolean
}

export const ButtonContainer = styled.button`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  cursor: pointer;

  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 115px;
  height: 30px;
  color: white;

  .loading {
    margin-left: 10px;
    color: white;
  }
`

export const Button: React.FC<ButtonProps> = (props) => {
  let bgColor = 'rgba(221, 221, 221, 0.5)'
  if (props.type === 'primary') {
    bgColor = '#2B454E'
  }

  return (
    <ButtonContainer
      disabled={props.disbaled}
      onClick={props?.disbaled === true ? undefined : props.onClick}
      style={{ opacity: props.disbaled ? '0.5' : 1, background: bgColor }}
    >
      {props.children}
      {props.isLoading === true ? (
        <CircularProgress className="loading" size="1em" />
      ) : null}
    </ButtonContainer>
  )
}
