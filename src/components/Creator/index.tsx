import React from 'react'
import styled from 'styled-components'
import { LazyLoadImage } from '../Image'
import { ReactComponent as PeopleSvg } from '../../assets/svg/people.svg'

const Container = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: ${(props: { fontSize?: number }) => `${props.fontSize ?? 12}px`};
  line-height: 17px;
  color: rgba(0, 0, 0, 0.6);
  .avatar {
    margin-left: 12px;
    margin-right: 2px;
    img {
      border-radius: 50%;
      width: 24px;
      height: 24px;
    }
    svg {
      position: relative;
      top: 2px;
    }
  }
  .name {
    color: rgba(0, 0, 0, 0.8);
    font-weight: normal;
    text-overflow: ellipsis;
  }
`

export interface CreatorProps {
  fontSize?: number
  url: string
  name: string
}

export const Creator: React.FC<CreatorProps> = ({ fontSize, url, name }) => {
  return (
    <Container fontSize={fontSize}>
      <span className="issuer">创作者</span>
      <span className="avatar">
        <LazyLoadImage
          src={url}
          width={24}
          height={24}
          variant="circle"
          backup={<PeopleSvg />}
        />
      </span>
      <span className="name">{name}</span>
    </Container>
  )
}
