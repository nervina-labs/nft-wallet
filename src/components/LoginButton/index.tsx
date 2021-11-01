import { Button, ButtonProps } from '@mibao-ui/components'

export const LoginButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button
      colorScheme="primary"
      fontWeight="normal"
      w="280px"
      variant="solid"
      fontSize="16px"
      mb="24px"
      {...rest}
    >
      {children}
    </Button>
  )
}
