import { HStack } from '@chakra-ui/react'
import { Image } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { getNFTQueryParams, isSupportWebp } from '../../../utils'

export const CardImageGroup: React.FC<{
  items: Array<{
    src: string
    tid: number | null
  }>
}> = ({ items }) => {
  const { i18n } = useTranslation('translations')
  return (
    <HStack overflowX="auto" overflowY="hidden" spacing="5px" h="60px">
      {items.map((item, i) => (
        <Image
          src={item.src === null ? '' : item.src}
          resizeScale={300}
          webp={isSupportWebp()}
          customizedSize={{
            fixed: 'large',
          }}
          w="60px"
          minW="60px"
          h="60px"
          rounded="16px"
          srcQueryParams={getNFTQueryParams(item.tid, i18n.language)}
          key={i}
        />
      ))}
    </HStack>
  )
}
