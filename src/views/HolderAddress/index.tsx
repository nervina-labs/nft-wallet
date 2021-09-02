import styled from 'styled-components'
import { MainContainer } from '../../styles'
import React from 'react'
import { Info } from '../Info'
import { Appbar } from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { useHistory, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;

  .detail {
    flex: 1;
    background-color: white;
    z-index: 2;
    padding: 15px;
  }

  .content {
    width: 100%;
  }
`

export const HolderAddress: React.FC = () => {
  const { address } = useParams<{ address: string }>()
  const history = useHistory()
  const { t } = useTranslation('translations')

  return (
    <Container>
      <Appbar
        title={t('holder.title')}
        left={<BackSvg onClick={() => history.goBack()} />}
        right={<></>}
      />
      <section className="detail">
        <Info address={address} />
      </section>
    </Container>
  )
}
