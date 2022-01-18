import { Box, Drawer, Flex, Stack } from '@mibao-ui/components'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NFTDetail } from '../../../models'
import { PlayingIcon } from './playingIcon'

export interface PlayListDrawerProps {
  width: number
  onClose: () => void
  isOpen: boolean
  data?: NFTDetail
  onChangeIndex: (index: number) => void
  index: number
}

export const PlayListDrawer: React.FC<PlayListDrawerProps> = ({
  width,
  onClose,
  isOpen,
  data,
  index,
  onChangeIndex,
}) => {
  const { t } = useTranslation('translations')
  const listRef = useRef<HTMLDivElement>(null)
  const [isShowing, setIsShowing] = useState(false)
  useEffect(() => {
    if (isOpen) {
      setIsShowing(true)
      const timer = setTimeout(() => {
        const listEl = listRef.current
        if (listEl) {
          listEl.scroll(0, index * 35)
          setIsShowing(false)
        }
      }, 300)
      return () => {
        clearTimeout(timer)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isOpen])

  return (
    <Drawer
      onClose={onClose}
      placement="bottom"
      isOpen={isOpen}
      hasCloseBtn
      contentProps={{
        height: '40%',
        minHeight: '200px',
        style: {
          width: `${width}px`,
          left: `calc(50% - ${width / 2}px)`,
        },
        overflowX: 'hidden',
        overflowY: 'auto',
        py: '15px',
      }}
    >
      <Box color="#999" fontSize="14px" h="22px">
        {t('nft.song')} {data?.album_audios?.length}
      </Box>
      <Stack
        w="full"
        h="calc(100% - 22px)"
        color="#666"
        py="20px"
        spacing="10px"
        overflowX="hidden"
        overflowY="auto"
        transition="200ms"
        ref={listRef}
        style={{
          opacity: isShowing ? 0 : 1,
        }}
      >
        {data?.album_audios?.map((audio, i) => (
          <Flex
            key={i}
            cursor="pointer"
            align="center"
            h="25px"
            onClick={() => {
              if (i === index) return
              onChangeIndex(i)
            }}
            style={{ color: i === index ? '#19933B' : undefined }}
          >
            <Box w="30px" mr="10px">
              {i === index ? <PlayingIcon /> : null}
            </Box>
            <Box whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
              {audio.name}
            </Box>
          </Flex>
        ))}
      </Stack>
    </Drawer>
  )
}
