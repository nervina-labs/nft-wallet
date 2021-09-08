import React from 'react'
import {
  withStyles,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { TokenClass } from '../../models/class-list'
import { NFTCard } from '../Reedem/NFTCard'
import { useTranslation } from 'react-i18next'
import { RedeemDetailModel } from '../../models/redeem'
import styled from 'styled-components'

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: '#EDEDED',
      color: theme.palette.common.black,
      fontSize: 12,
    },
    body: {
      fontSize: 12,
      backgroundColor: '#f6f6f6',
    },
  })
)(TableCell)

const useStyles = makeStyles({
  table: {
    minWidth: '100%',
  },
})

export interface ICondition {
  token: TokenClass
  needed: number
  holded: number
}

export interface ConditionProps {
  detail: RedeemDetailModel
}

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
    padding: 6px 0;
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
  const classes = useStyles()
  const [t] = useTranslation('translations')

  return (
    <Container>
      <div className="contain">{t('exchange.event.condition')}</div>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell>{t('exchange.condition.nft')}</StyledTableCell>
              <StyledTableCell align="right">
                {t('exchange.condition.needed')}
              </StyledTableCell>
              <StyledTableCell align="right">
                {t('exchange.condition.held')}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detail.tokens.map((token, i) => (
              <TableRow key={i}>
                <StyledTableCell component="th" scope="row">
                  <NFTCard token={token} />
                </StyledTableCell>
                <StyledTableCell align="right">
                  {t('exchange.count', { count: 5 })}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {t('exchange.count', { count: 3 })}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}
