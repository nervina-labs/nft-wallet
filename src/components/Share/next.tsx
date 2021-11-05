import { Modal, ModalContent, ModalOverlay } from '@mibao-ui/components'

export const Share: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay></ModalOverlay>
      <ModalContent>Share</ModalContent>
    </Modal>
  )
}
