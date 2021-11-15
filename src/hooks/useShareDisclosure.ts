import { useDisclosure } from '@chakra-ui/react'
import { useCallback, useState } from 'react'

export function useShareDisclosure() {
  const { isOpen: isOpenShare, onOpen, onClose: onCloseShare } = useDisclosure()
  const [neverOpened, setNeverOpened] = useState(true)
  const onOpenShare = useCallback(() => {
    setNeverOpened(false)
    onOpen()
  }, [onOpen])

  return {
    isOpenShare,
    onOpenShare,
    onCloseShare,
    neverOpened,
  }
}
