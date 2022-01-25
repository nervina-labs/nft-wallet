import { Box, BoxProps } from '@chakra-ui/react'

interface ProgressBarProps extends BoxProps {
  progress: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  ...props
}) => {
  return (
    <Box rounded="100px" h="6px" bg="#EFF1F3" {...props}>
      <Box bg="#02C2C6" rounded="100px" w={`${progress}%`} h="100%" />
    </Box>
  )
}
