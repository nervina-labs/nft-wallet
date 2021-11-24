import React from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th as RawTh,
  Td as RawTd,
  TableCellProps,
  Box,
  Flex,
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

const Container = styled(Flex)`
  padding: 0 20px;
  flex-direction: column;
  th {
    white-space: nowrap;
    font-weight: normal;
    background-color: #e5e8f9;
  }
`

export const Condition: React.FC<ConditionProps> = ({ detail }) => {
  const [t] = useTranslation('translations')

  return (
    <Container>
      <Box color="#5065E5" fontSize="12px" mb="15px" fontWeight="500">
        {t('exchange.event.condition')}
      </Box>
      <Table variant="unstyled">
        <Thead>
          <Tr>
            <Th
              textAlign="left"
              roundedTopLeft="4px"
              roundedBottomLeft="4px"
              pl="8px"
            >
              {t('exchange.condition.nft')}
            </Th>
            <Th textAlign="center">{t('exchange.condition.needed')}</Th>
            <Th
              textAlign="right"
              roundedTopRight="4px"
              roundedBottomRight="4px"
              pr="8px"
            >
              {t('exchange.condition.held')}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {detail.rule_info.options.map((option, i) => (
            <Tr key={i}>
              <Td p="4px" textAlign="left">
                <NFTCard info={option} />
              </Td>
              <Td p="4px" textAlign="center" fontSize="12px">
                {t('exchange.count', { count: option.item_count })}
              </Td>
              <Td p="4px" fontSize="12px" textAlign="right" pr="8px">
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
