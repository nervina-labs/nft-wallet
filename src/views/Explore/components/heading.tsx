import { Box, BoxProps } from '@chakra-ui/react'

export const Heading: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box fontWeight="200" fontSize="24px" px="20px" mt="30px" {...props}>
      {children}
    </Box>
  )
}
