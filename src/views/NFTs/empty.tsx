import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Emptypng from '../../assets/img/empty.png'
import { NFT_EXPLORER_URL } from '../../constants'
import { LazyLoadImage } from '../../components/Image'

const Container = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    margin-top: 100px;
  }
  .desc {
    margin-top: 30px;
    font-size: 16px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 600;
  }
  .link {
    margin-top: 15px;
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
      <LazyLoadImage src={Emptypng} width={260} height={172} />
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
