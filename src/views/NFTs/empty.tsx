import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ReactComponent as EmptySvg } from '../../assets/svg/empty.svg'
import { NFT_EXPLORER_URL } from '../../constants'

const Container = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .desc {
    margin-top: 12px;
    font-size: 16px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 600;
  }
  .link {
    margin-top: 32px;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    text-decoration-line: underline;
    color: rgba(0, 0, 0, 0.8);
  }
`

export const Empty: React.FC = () => {
  const { t } = useTranslation('translations')
  return (
    <Container>
      <EmptySvg />
      <div className="desc">{t('nfts.no-data')}</div>
      <a
        className="link"
        target="_blank"
        rel="noopener noreferrer"
        href={NFT_EXPLORER_URL}
      >
        {t('nfts.link')}
      </a>
    </Container>
  )
}
