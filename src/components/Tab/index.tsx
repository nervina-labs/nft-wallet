import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

const TabsContainer = styled.nav`
  display: flex;
  justify-content: center;
  position: relative;
`

const TabContainer = styled.div`
  --size-height: 40px;
  height: var(--size-height);
  line-height: var(--size-height);
  font-size: 16px;
  white-space: nowrap;
  margin: auto;
  width: 100%;
  text-align: center;
  color: #8e8e93;
  cursor: pointer;
  &.active {
    color: #000;
  }
`

const TabsAffixContainer = styled.div`
  position: sticky;
  top: 0;
`

const ActiveBar = styled.div`
  bottom: 0;
  left: 0;
  position: absolute;
  display: flex;
  width: 100%;
  height: 3px;
  transition: 0.2s;
  &:before {
    content: ' ';
    width: 30px;
    height: 100%;
    background-color: #ff5c00;
    margin: auto;
    border-radius: 10px;
  }
`

interface TabsAffixProps extends HTMLAttributes<HTMLDivElement> {
  top: number
  zIndex?: number
}

export const TabsAffix: React.FC<TabsAffixProps> = (props) => {
  const { top, zIndex, children } = props
  return (
    <TabsAffixContainer style={{ top, zIndex }} {...props}>
      {children}
    </TabsAffixContainer>
  )
}

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  activeKey: number
}

export const Tabs: React.FC<TabsProps> = (props) => {
  const { children, activeKey } = props
  return (
    <TabsContainer {...props}>
      {children}
      <ActiveBar
        style={{
          width: `calc(100% / ${(children as { length: number }).length})`,
          transform: `translateX(${activeKey * 100}%)`,
        }}
      />
    </TabsContainer>
  )
}

interface TabProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean
}

export const Tab: React.FC<TabProps> = (props) => {
  const { children, active } = props
  return (
    <TabContainer
      {...props}
      className={[
        props.className,
        classNames({
          active,
        }),
      ].join(' ')}
    >
      {children}
    </TabContainer>
  )
}
