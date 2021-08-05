import React from 'react'
import { InputBase, InputBaseProps } from '@material-ui/core'

const checkisChrome = (): boolean => {
  return !!(window as any).chrome
}
const checkIOSVer = (): number | null => {
  const match = window.navigator.userAgent.match(/\d[\d]*_\d[_\d]*/i)
  if (match) {
    return parseFloat(match[0].split('-').join('.'))
  }
  return null
}

interface InputBaseFixProps {
  formatter: (v: string) => string
}

type Props = InputBaseProps & InputBaseFixProps

export class InputBaseFix extends React.Component<Props> {
  private onComposition = true
  private readonly isChrome = checkisChrome()
  private readonly iOSver: number | null = checkIOSVer()

  handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e): void => {
    const { onChange, formatter } = this.props

    if (typeof onChange === 'function') {
      let value = e.target.value
      if (this.onComposition && formatter) {
        value = formatter(value)
      }

      onChange({
        ...e,
        target: {
          ...e.target,
          value,
        },
      })
    }
  }

  handleComposition: React.ChangeEventHandler<HTMLInputElement> = (e): void => {
    if (e.type === 'compositionend') {
      this.onComposition = true
      if (this.isChrome || (this.iOSver && this.iOSver >= 10.3)) {
        this.handleInputChange(e)
      }
    } else {
      this.onComposition = false
    }
  }

  render(): React.ReactNode {
    const { children, onChange, formatter, ...otherProps } = this.props

    return (
      <InputBase
        {...(otherProps as any)}
        onChange={this.handleInputChange}
        onCompositionStart={this.handleComposition}
        onCompositionUpdate={this.handleComposition}
        onCompositionEnd={this.handleComposition}
      />
    )
  }
}
