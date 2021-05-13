import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { RoutePath } from '../../routes'
import { ReactComponent as AccountSvg } from '../../assets/svg/account.svg'

const Header = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 500px;
  display: flex;
  background: ${(props: { bgColor?: string }) => `${props.bgColor ?? '#fff'}`};
  flex-direction: row;
  height: 44px;
  align-items: center;
  box-shadow: ${(props: { bgColor?: string }) =>
    `${
      props.bgColor !== 'transparent'
        ? '0px 4px 12px rgba(0, 0, 0, 0.06)'
        : 'none'
    }`};
  z-index: 100;
  .left {
    margin-left: 12px;
    width: 20px;
  }
  .title {
    color: ${(props: { bgColor?: string }) =>
      `${props.bgColor === 'transparent' ? '#fff' : '#000'}`};
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
      fill: ${(props: { bgColor?: string }) =>
        `${props.bgColor === 'transparent' ? '#fff' : '#000'}`};
    }
    ellipse {
      fill: ${(props: { bgColor?: string }) =>
        `${props.bgColor === 'transparent' ? '#fff' : '#000'}`};
    }
  }
`

export interface AppbarProps {
  title: React.ReactNode
  left?: React.ReactNode
  right?: React.ReactNode
  back?: boolean
  bgColor?: string
}

// eslint-disable-next-line prettier/prettier
export const Appbar: React.ForwardRefExoticComponent<AppbarProps & React.RefAttributes<HTMLElement>
> = React.forwardRef(
  (
    { title, left = null, right, bgColor },
    ref: React.ForwardedRef<HTMLElement>
  ) => {
    const history = useHistory()
    return (
      <Header ref={ref} bgColor={bgColor}>
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
