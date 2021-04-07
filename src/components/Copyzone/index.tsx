import React, { useCallback, useState } from 'react'
import { ReactComponent as CopySvg } from '../../assets/svg/copy.svg'
import { ReactComponent as CheckSvg } from '../../assets/svg/check.svg'
import { sleep } from '../../utils'
import { Tooltip } from '@material-ui/core'
import styled from 'styled-components'

export interface CopyzoneProps {
  text: string
  displayText: string
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 32px;
  .text {
    word-break: break-all;
    font-size: 14px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
  }
  svg {
    min-width: 20px;
    margin-left: 10px;
  }
`

export const Copyzone: React.FC<CopyzoneProps> = ({ text, displayText }) => {
  const [isCopy, setIsCopy] = useState(false)
  const onCopy = useCallback(async () => {
    setIsCopy(true)
    try {
      await navigator.clipboard?.writeText(text)
    } catch (error) {
      //
    }
    await sleep(1000)
    setIsCopy(false)
  }, [text])

  return (
    <Container>
      <span className="text">{displayText}</span>
      {!isCopy ? (
        <CopySvg onClick={onCopy} />
      ) : (
        <Tooltip open title="已复制" placement="top">
          <CheckSvg />
        </Tooltip>
      )}
    </Container>
  )
}
