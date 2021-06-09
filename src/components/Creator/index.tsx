import React from 'react'
import styled from 'styled-components'
import { LazyLoadImage } from '../Image'
import { ReactComponent as PeopleSvg } from '../../assets/svg/people.svg'
import { NFT_EXPLORER_URL } from '../../constants'
import { useTranslation } from 'react-i18next'

const Container = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: ${(props: { fontSize?: number }) => `${props.fontSize ?? 12}px`};
  line-height: 17px;
  color: rgba(0, 0, 0, 0.6);
  .error {
    color: #d03a3a;
  }
  .avatar {
    margin-right: 6px;
    max-height: 24px;
    img {
      border-radius: 50%;
      width: 24px;
      height: 24px;
      min-width: 24px;
    }
    svg {
      width: 24px;
      height: 24px;
    }
  }
  .issuer {
    white-space: nowrap;
    margin-right: 12px;
  }
  .name {
    color: ${(props: { color?: string }) =>
      `${props.color ?? 'rgba(5, 1, 1, 0.8)'}`};
    font-weight: normal;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  > a {
    display: flex;
    align-items: center;
    overflow: hidden;
  }
`

export interface CreatorProps {
  fontSize?: number
  url: string
  name: string
  uuid?: string
  title?: React.ReactNode
  color?: string
  baned?: boolean
}

export const Creator: React.FC<CreatorProps> = ({
  fontSize,
  url,
  name,
  uuid,
  title,
  color,
  baned = false,
}) => {
  const { t } = useTranslation('translations')
  const creator = (
    <>
      <span className="avatar">
        {baned ? (
          <PeopleSvg />
        ) : (
          <LazyLoadImage
            src={url}
            width={24}
            height={24}
            variant="circle"
            backup={<PeopleSvg />}
          />
        )}
      </span>
      <span className={`name ${baned ? 'error' : ''}`}>
        {baned ? t('common.baned.issuer') : name}
      </span>
    </>
  )
  return (
    <Container fontSize={fontSize} color={color}>
      {title ?? <span className="issuer">{t('common.creator')}</span>}
      {uuid != null ? (
        <a
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          style={{ textDecoration: 'none' }}
          rel="noopener noreferrer"
          href={`${NFT_EXPLORER_URL}/issuer/tokens/${uuid}`}
        >
          {creator}
        </a>
      ) : (
        creator
      )}
    </Container>
  )
}
