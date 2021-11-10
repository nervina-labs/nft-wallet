import React, { useMemo } from 'react'
import {
  Input as RawInput,
  InputProps as RawInputProps,
  Textarea,
} from '@chakra-ui/react'
import { Flex, Text, TextProps, FlexProps } from '@mibao-ui/components'
import { ReactComponent as SelectedArrow } from '../../assets/svg/right-arrow.svg'

export interface InputProps extends RawInputProps, InputBaseFixProps {
  label?: string
  value?: string
  max: number
  errorMsg?: string
}

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
  formatter?: (v: string) => string
  isTextarea?: boolean
}

type Props = InputProps & RawInputProps

class InputFix extends React.Component<Props> {
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
    const {
      children,
      onChange,
      formatter,
      isTextarea = false,
      ...otherProps
    } = this.props

    if (isTextarea) {
      return (
        <Textarea
          resize="none"
          {...(otherProps as any)}
          onChange={this.handleInputChange}
          onCompositionStart={this.handleComposition}
          onCompositionUpdate={this.handleComposition}
          onCompositionEnd={this.handleComposition}
        />
      )
    }

    return (
      <RawInput
        {...(otherProps as any)}
        onChange={this.handleInputChange}
        onCompositionStart={this.handleComposition}
        onCompositionUpdate={this.handleComposition}
        onCompositionEnd={this.handleComposition}
      />
    )
  }
}

const Label: React.FC<TextProps> = ({ children, ...rest }) => {
  return (
    <Text fontSize="14px" color="gray.500">
      {children}
    </Text>
  )
}

export const Input: React.FC<InputProps> = ({
  label,
  value = '',
  errorMsg,
  max,
  ...rest
}) => {
  const len = useMemo(() => {
    if (value.length >= max) return max
    return value.length
  }, [value, max])

  return (
    <>
      <Flex
        flexDirection="column"
        padding="16px"
        bg="#F6F6F6"
        borderRadius="10px"
      >
        {label ? <Label mb="6px">{label}</Label> : null}
        <InputFix
          label={label}
          focusBorderColor="transparent"
          borderColor="white"
          variant="unstyled"
          fontSize="14px"
          value={value}
          max={max}
          {...rest}
        />
      </Flex>
      <Flex justifyContent="space-between" style={{ marginTop: '4px' }}>
        <Text color="gray.500" fontSize="12px">
          {errorMsg}
        </Text>
        <Text color="gray.500" fontSize="12px">{`${len}/${max}`}</Text>
      </Flex>
    </>
  )
}

export interface SelectProps extends FlexProps {
  label: string
  value?: string
}

export const Select: React.FC<SelectProps> = ({ label, value, ...rest }) => {
  return (
    <Flex
      flexDirection="row"
      padding="16px"
      bg="#F6F6F6"
      borderRadius="10px"
      justifyContent="space-between"
      cursor="pointer"
      {...rest}
    >
      <Label>{label}</Label>
      <Flex flexDirection="row" alignItems="center">
        <Text fontSize="14px" mr="12px">
          {value}
        </Text>
        <SelectedArrow />
      </Flex>
    </Flex>
  )
}
