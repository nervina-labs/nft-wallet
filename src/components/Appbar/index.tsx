import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { RoutePath } from '../../routes'
import { ReactComponent as AccountSvg } from '../../assets/svg/account.svg'

const Header = styled.header`
  position: sticky;
  top: 0;
  display: flex;
  background: #fff;
  flex-direction: row;
  height: 44px;
  align-items: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.06);
  .left {
    margin-left: 12px;
    width: 20px;
  }
  .title {
    flex: 1;
    font-weight: 600;
    text-align: center;
  }
  .right {
    margin-right: 12px;
    width: 20px;
  }
`

export interface AppbarProps {
  title: string
  left?: React.ReactNode
  right?: React.ReactNode
  back?: boolean
}

// eslint-disable-next-line prettier/prettier
export const Appbar: React.ForwardRefExoticComponent<AppbarProps & React.RefAttributes<HTMLElement>
> = React.forwardRef(
  ({ title, left = null, right }, ref: React.ForwardedRef<HTMLElement>) => {
    const history = useHistory()
    return (
      <Header ref={ref}>
        <span className="left">{left}</span>
        <span className="title">{title}</span>
        <span className="right">
          {right ?? (
            <AccountSvg
              onClick={() => {
                history.push(RoutePath.Account)
              }}
            />
          )}
        </span>
      </Header>
    )
  }
)
