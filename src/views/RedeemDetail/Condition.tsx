import React from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th as RawTh,
  Td as RawTd,
  TableCellProps,
} from '@chakra-ui/react'
import { TokenClass } from '../../models/class-list'
import { NFTCard } from '../Redeem/NFTCard'
import { useTranslation } from 'react-i18next'
import { RedeemDetailModel } from '../../models/redeem'
import styled from 'styled-components'

export interface ICondition {
  token: TokenClass
  needed: number
  holded: number
}

export interface ConditionProps {
  detail: RedeemDetailModel
}

const Th: React.FC<TableCellProps> = (props) => (
  <RawTh padding="12px 4px" {...props} />
)

const Td: React.FC<TableCellProps> = (props) => (
  <RawTd padding="12px 4px" {...props} />
)

const Container = styled.div`
  padding: 20px;
  padding-top: 8px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  .contain {
    background: #fff5c5;
    margin: 10px 0;
    font-size: 12px;
    padding: 8px;
  }

  .MuiPaper-elevation1 {
    box-shadow: none;
  }
  .MuiTableCell-root {
    padding: 6px 3px;
    word-break: keep-all;
    border: none;
    &:first-child {
      padding: 6px 10px;
      padding-right: 0;
    }
    &:last-child {
      padding: 6px 10px;
      padding-left: 0;
    }
  }
`

export const Condition: React.FC<ConditionProps> = ({ detail }) => {
  const [t] = useTranslation('translations')

  return (
    <Container>
      <div className="contain">{t('exchange.event.condition')}</div>
      <Table variant="unstyled">
        <Thead bg="#ededed">
          <Tr>
            <Th textAlign="left">{t('exchange.condition.nft')}</Th>
            <Th textAlign="right">{t('exchange.condition.needed')}</Th>
            <Th textAlign="right">{t('exchange.condition.held')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {detail.rule_info.options.map((option, i) => (
            <Tr key={i}>
              <Td textAlign="left">
                <NFTCard info={option} />
              </Td>
              <Td align="right" fontSize="12px" textAlign="right">
                {t('exchange.count', { count: option.item_count })}
              </Td>
              <Td align="right" fontSize="12px" textAlign="right">
                <span
                  style={{
                    color:
                      option.item_owned_count < option.item_count
                        ? '#FF5C00'
                        : '',
                  }}
                >
                  {t('exchange.count', { count: option.item_owned_count })}
                </span>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  )
}
