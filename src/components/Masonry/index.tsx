import React, { Children } from 'react'
import styled from 'styled-components'

export interface WrapperProps {
  columns?: number
  gridGap: string
}

const Wrapper = styled.ul`
  display: grid;
  grid-template-columns: repeat(${({ columns }: WrapperProps) => columns}, 1fr);
  grid-gap: ${({ gridGap }: WrapperProps) => gridGap};
`

const Column = styled.li`
  display: grid;
  grid-gap: ${({ gridGap }: WrapperProps) => gridGap};
  grid-auto-rows: max-content;
`

export interface MasonryProps {
  columns?: number
  gridGap?: string
  isProvideLi?: boolean
  children?: React.ReactNode
}

export const Masonry: React.FC<MasonryProps> = ({
  columns = 3,
  gridGap = '1rem',
  isProvideLi = true,
  children,
}) => {
  // split children into N arrays for columns
  const output = Children.toArray(children).reduce<React.ReactNode[][]>(
    (acc, child, i) => {
      acc[i % columns] = [...acc[i % columns], child]
      return acc
    },
    new Array(columns).fill([])
  )

  return (
    <Wrapper columns={columns} gridGap={gridGap}>
      {output.map((column, i) => (
        <Column key={i} gridGap={gridGap}>
          {column}
        </Column>
      ))}
    </Wrapper>
  )
}
