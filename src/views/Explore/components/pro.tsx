import { Box } from '@mibao-ui/components'
import { Recommend } from './recommend'

export const Pro: React.FC = () => {
  return (
    <Box mt="30px">
      <Box fontWeight="200" fontSize="24px" px="20px">
        秘宝推荐
      </Box>
      <Recommend />
    </Box>
  )
}
