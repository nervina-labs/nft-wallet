import React, { HTMLAttributes, useEffect, useRef, useState } from 'react'
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
  padding: 0 5px;
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
  width: 30px;
  background-color: #ff5c00;
  height: 3px;
  transition: 0.2s;
  border-radius: 10px;
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
  const tabsRef = useRef<HTMLDivElement>(null)
  const [activeBarTranslateX, setActiveBarTranslateX] = useState(0)
  const tabCount = (children as []).filter((e) => e).length
  useEffect(() => {
    const childrenElements = Array.from(
      (tabsRef.current?.children ?? []) as HTMLDivElement[]
    ).filter((el) => el.className.startsWith('Tab__TabContainer'))
    if (childrenElements.length > 0) {
      const width = childrenElements[activeKey].offsetWidth
      const translateX = childrenElements
        .slice(0, activeKey)
        .reduce((acc, el) => acc + el.offsetWidth, 0)
      setActiveBarTranslateX(translateX + (Math.floor(width / 2) - 15))
    }
  }, [activeKey, tabCount])

  return (
    <TabsContainer {...props} ref={tabsRef}>
      {children}
      <ActiveBar
        style={{
          transform: `translateX(${activeBarTranslateX}px)`,
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
