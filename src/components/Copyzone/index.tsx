import React, { useCallback, useState } from 'react'
import { ReactComponent as CopySvg } from '../../assets/svg/copy.svg'
import { ReactComponent as CheckSvg } from '../../assets/svg/check.svg'
import { copyFallback, sleep } from '../../utils'
import * as clipboard from 'clipboard-polyfill/text'
import styled from 'styled-components'
import { IS_ANDROID, IS_WEXIN } from '../../constants'

export interface CopyzoneProps {
  text: string
  displayText: string
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  .text {
    word-break: break-all;
    font-size: 14px;
    line-height: 16px;
    color: #333;
  }
  .copyable {
    cursor: pointer;
    path {
      fill: #6e8ae6;
    }
  }
  svg {
    min-width: 20px;
    margin-left: 4px;
    width: 14px;
    height: 14px;
  }
`

export const Copyzone: React.FC<CopyzoneProps> = ({ text, displayText }) => {
  const [isCopy, setIsCopy] = useState(false)
  const onCopy = useCallback(async () => {
    setIsCopy(true)
    const isAndroidWeChat = IS_WEXIN && IS_ANDROID
    const content = isAndroidWeChat
      ? text.replace('https://', '').replace('http://', '')
      : text
    try {
      await clipboard.writeText(content)
    } catch (error) {
      copyFallback(content)
    }
    await sleep(1000)
    setIsCopy(false)
  }, [text])

  return (
    <Container>
      <span className="text">{displayText}</span>
      {!isCopy ? (
        <CopySvg onClick={onCopy} className="copyable" />
      ) : (
        <CheckSvg />
      )}
    </Container>
  )
}
