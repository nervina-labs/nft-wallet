import React from 'react'
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
    word-break: break-word;
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

export interface CopyzoneState {
  isCopy: boolean
}
export class Copyzone extends React.Component<CopyzoneProps, CopyzoneState> {
  state = {
    isCopy: false,
  }

  onCopy = async (): Promise<void> => {
    const { text } = this.props
    this.setState({
      isCopy: true,
    })
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
    this.setState({
      isCopy: false,
    })
  }

  render(): React.ReactNode {
    const { isCopy } = this.state
    const { displayText } = this.props
    return (
      <Container>
        <span className="text">{displayText}</span>
        {!isCopy ? (
          <CopySvg onClick={this.onCopy} className="copyable" />
        ) : (
          <CheckSvg />
        )}
      </Container>
    )
  }
}
