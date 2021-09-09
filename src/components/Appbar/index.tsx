import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { RoutePath } from '../../routes'
import { ReactComponent as AccountSvg } from '../../assets/svg/account.svg'

export interface HeaderProps {
  transparent?: boolean
}

export const HEADER_HEIGHT = 44 as const

const Header = styled.header<HeaderProps>`
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 500px;
  display: flex;
  background: ${(props: HeaderProps) =>
    `${
      props.transparent
        ? 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%)'
        : '#fff'
    }`};
  flex-direction: row;
  height: ${HEADER_HEIGHT}px;
  align-items: center;
  box-shadow: ${(props: HeaderProps) =>
    `${!props.transparent ? '0px 4px 12px rgba(0, 0, 0, 0.06)' : 'none'}`};
  z-index: 100;
  .left {
    margin-left: 12px;
    width: 20px;
  }
  .title {
    color: ${(props: HeaderProps) => `${props.transparent ? '#fff' : '#000'}`};
    flex: 1;
    text-align: center;
    display: flex;
    align-items: center;
    font-size: 16px;
    justify-content: center;
  }
  .right {
    margin-right: 12px;
    width: 20px;
  }
  .right,
  .left {
    display: flex;
    align-items: center;
    justify-content: center;
    img,
    svg {
      cursor: pointer;
      width: 20px;
      height: 20px;
    }
  }
  svg {
    cursor: pointer;

    path {
      fill: ${(props: HeaderProps) => `${props.transparent ? '#fff' : '#000'}`};
    }
    ellipse {
      fill: ${(props: HeaderProps) => `${props.transparent ? '#fff' : '#000'}`};
    }
  }
`

export interface AppbarProps {
  title: React.ReactNode
  left?: React.ReactNode
  right?: React.ReactNode
  back?: boolean
  transparent?: boolean
  className?: string
}

// eslint-disable-next-line prettier/prettier
export const Appbar: React.ForwardRefExoticComponent<AppbarProps & React.RefAttributes<HTMLElement>
> = React.forwardRef(
  (
    { title, left = null, right, transparent, className },
    ref: React.ForwardedRef<HTMLElement>
  ) => {
    const history = useHistory()
    return (
      <Header ref={ref} transparent={transparent} className={className}>
        <span className="left">{left}</span>
        <span className="title">{title}</span>
        <span className="right">
          {right ?? (
            <AccountSvg
              onClick={() => {
                history.push(RoutePath.Info)
              }}
            />
          )}
        </span>
      </Header>
    )
  }
)
