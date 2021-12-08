import { Box, BoxProps } from '@mibao-ui/components'

export const Title: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box color="#777E90" fontSize="12px" mb="16px" {...props}>
      {children}
    </Box>
  )
}
