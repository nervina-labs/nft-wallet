import React, { useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as UpSvg } from '../../assets/svg/up.svg'
import { ReactComponent as DownSvg } from '../../assets/svg/down.svg'
import { IS_MAINNET } from '../../constants'
import { makeStyles } from '@material-ui/core/styles'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: 20,
    right: 0,
    left: 0,
    zIndex: 1,
  },
}))

const Container = styled.div`
  position: relative;
  color: #090909;
  .area {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-items: center;
    .status {
      color: black;
      font-weight: normal;
      font-size: 12px;
      line-height: 17px;
      margin-right: 4px;
      opacity: 0.6;
    }
    svg {
      opacity: 0.6;
    }
  }
`

const PopoverContainer = styled.div`
  padding: 0 2px;
  font-size: 12px;
  line-height: 17px;
  background: #ffffff;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  width: 72px;
  .change {
    display: block;
    text-decoration: none;
    color: black;
    font-size: 12px;
    line-height: 17px;
    text-align: center;
    margin: 5px 0;
    padding: 0 16px;
    font-weight: normal;
    &:hover {
      background: #c4c4c4;
      border-radius: 2px;
    }
  }
`

export interface NetChangeProps {
  mainnetURL: string
  testnetURL: string
}

export const NetChange: React.FC<NetChangeProps> = ({
  mainnetURL,
  testnetURL,
}) => {
  const { t } = useTranslation('translations')
  const mainnet = t('common.chain.mainnet')
  const testnet = t('common.chain.testnet')
  const netStatus = IS_MAINNET ? mainnet : testnet

  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const handleClick = (): void => {
    setOpen((prev) => !prev)
  }

  return (
    <ClickAwayListener
      onClickAway={() => {
        setOpen(false)
      }}
    >
      <Container>
        <div className="area" onClick={handleClick}>
          <span className="status">{netStatus}</span>
          {open ? <UpSvg /> : <DownSvg />}
        </div>
        {open ? (
          <PopoverContainer className={classes.dropdown}>
            <a href={mainnetURL} className="change">
              {mainnet}
            </a>
            <a href={testnetURL} className="change">
              {testnet}
            </a>
          </PopoverContainer>
        ) : null}
      </Container>
    </ClickAwayListener>
  )
}
