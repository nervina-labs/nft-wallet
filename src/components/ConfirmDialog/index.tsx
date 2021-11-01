import React from 'react'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalFooterButtonGroup,
  ModalOverlay,
  Button,
} from '@mibao-ui/components'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { useConfirmDialogModel } from '../../hooks/useConfirmDialog'
import { noop } from '../../utils'
import { useTranslation } from 'react-i18next'

export const ConfirmDialog: React.FC = () => {
  const {
    options,
    isOpen,
    isLoading,
    onClose,
    onConfirm,
    onCancel,
  } = useConfirmDialogModel()
  const {
    type = 'success',
    title,
    description,
    content,
    cancelText,
    okText,
    modalBodyProps,
    modalContentProps,
    modalProps,
    showCloseButton = true,
  } = options
  const [t] = useTranslation('translations')

  return (
    <Modal
      size="xs"
      closeOnEsc={showCloseButton}
      closeOnOverlayClick={showCloseButton}
      {...modalProps}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent borderRadius="24px" {...modalContentProps}>
        {showCloseButton ? <ModalCloseButton /> : null}
        <ModalBody {...modalBodyProps}>
          {content ?? (
            <>
              <Alert
                status={type}
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                bg="white"
              >
                <AlertIcon boxSize="70px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="16px" fontWeight="normal">
                  {title}
                </AlertTitle>
                <AlertDescription
                  maxWidth="sm"
                  fontSize="14px"
                  color="gray.500"
                >
                  {description}
                </AlertDescription>
              </Alert>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <ModalFooterButtonGroup>
            <Button
              isFullWidth
              variant="solid"
              colorScheme="primary"
              isLoading={isLoading}
              onClick={onConfirm}
            >
              {okText ?? t('common.actions.comfirm')}
            </Button>

            {onCancel !== noop ? (
              <Button isFullWidth onClick={onCancel}>
                {cancelText ?? t('common.actions.cancel')}
              </Button>
            ) : null}
          </ModalFooterButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
