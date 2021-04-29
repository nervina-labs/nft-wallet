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
  margin: 0 32px;
  .text {
    word-break: break-all;
    font-size: 14px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
  }
  .copyable {
    cursor: pointer;
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
      const isAndroidWeChat = IS_WEXIN && IS_ANDROID
      await clipboard.writeText(
        isAndroidWeChat
          ? text.replace('https://', '').replace('http://', '')
          : text
      )
    } catch (error) {
      copyFallback(text)
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
