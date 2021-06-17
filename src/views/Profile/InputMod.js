/* eslint-disable space-before-function-paren */
// eslint-disable-next-line no-unused-vars
import React from 'react'
// eslint-disable-next-line no-unused-vars
import { InputBase } from '@material-ui/core'

const checkisChrome = () => {
  return !!window.chrome
}
const checkIOSVer = () => {
  const match = window.navigator.userAgent.match(/\d[\d]*_\d[_\d]*/i)
  if (match) {
    return parseFloat(match[0].split('-').join('.'))
  }
  return null
}

export class InputBaseFix extends React.Component {
  constructor(props) {
    super(props)
    this.onComposition = true
    this.isChrome = checkisChrome()
    this.IOSver = checkIOSVer()
  }

  handleInputChange(evt) {
    const { name, onChange, formatter } = this.props

    if (typeof onChange === 'function') {
      let value = evt.target.value
      if (this.onComposition && formatter) {
        value = formatter(value)
      }

      onChange({ target: { value, name } })
    }
  }

  handleComposition(evt) {
    if (evt.type === 'compositionend') {
      this.onComposition = true

      if (this.isChrome || (this.IOSVer && this.IOSVer >= 10.3)) {
        this.handleInputChange(evt)
      }
    } else {
      this.onComposition = false
    }
  }

  render() {
    const { children, onChange, formatter, ...otherProps } = this.props

    return (
      <InputBase
        {...otherProps}
        onChange={this.handleInputChange.bind(this)}
        onCompositionStart={this.handleComposition.bind(this)}
        onCompositionUpdate={this.handleComposition.bind(this)}
        onCompositionEnd={this.handleComposition.bind(this)}
      />
    )
  }
}
