import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
} from '@chakra-ui/react'
import { AlbumPlayer } from '../../../components/AlbumPlayer'
import { Appbar, AppbarSticky } from '../../../components/Appbar'
import { CONTAINER_MAX_WIDTH } from '../../../constants'
import { useInnerSize } from '../../../hooks/useInnerSize'
import { NFTDetail } from '../../../models'

export const AlbumPlayerDrawer: React.FC<{
  isLoading?: boolean
  data: NFTDetail
  isOpen: boolean
  onClose: () => void
}> = ({ isLoading, data, isOpen, onClose }) => {
  const { width: innerWidth } = useInnerSize({ dueTime: 0 })
  const width = Math.min(innerWidth, CONTAINER_MAX_WIDTH)

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
      <DrawerOverlay />
      <DrawerContent
        bg="#000"
        w="full"
        h="full"
        style={{
          maxWidth: `calc(${CONTAINER_MAX_WIDTH}px + var(--removed-body-scroll-bar-size))`,
          left: `calc(50% - ${
            width / 2
          }px - var(--removed-body-scroll-bar-size))`,
        }}
      >
        <DrawerBody p="0" position="relative">
          <AppbarSticky position="absolute" top="0" left="0" w="full">
            <Appbar transparent onLeftClick={onClose} />
          </AppbarSticky>
          <AlbumPlayer isLoading={isLoading} data={data} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
