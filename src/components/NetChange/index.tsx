import React, { useMemo, useRef } from 'react'
import styled from 'styled-components'
import { ReactComponent as UpSvg } from '../../assets/svg/up.svg'
import { ReactComponent as DownSvg } from '../../assets/svg/down.svg'
import { IS_MAINNET } from '../../constants'
import { Popover } from '@material-ui/core'

const Container = styled.div`
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
    }
  }
`

const PopoverContainer = styled.div`
  padding: 0 2px;
  font-size: 12px;
  line-height: 17px;
  .change {
    display: block;
    text-decoration: none;
    color: black;
    font-size: 12px;
    line-height: 17px;
    text-align: center;
    margin: 5px 0;
    padding: 0 16px;
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
  const mainnet = '主网'
  const testnet = '测试网'
  const netStatus = IS_MAINNET ? mainnet : testnet

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)

  const handleClose = (): void => {
    setAnchorEl(null)
  }

  const containerRef = useRef(null)

  const open = useMemo(() => Boolean(anchorEl), [anchorEl])
  return (
    <Container>
      <div
        className="area"
        ref={containerRef}
        onClick={(e) => {
          setAnchorEl(e.currentTarget)
        }}
      >
        <span className="status">{netStatus}</span>
        {open ? <UpSvg /> : <DownSvg />}
      </div>
      <Popover
        anchorEl={anchorEl}
        open={open}
        onBackdropClick={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleClose}
      >
        <PopoverContainer>
          <a href={mainnetURL} className="change">
            {mainnet}
          </a>
          <a href={testnetURL} className="change">
            {testnet}
          </a>
        </PopoverContainer>
      </Popover>
    </Container>
  )
}
