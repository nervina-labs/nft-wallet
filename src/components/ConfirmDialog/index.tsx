import React from 'react'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Button,
} from '@mibao-ui/components'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
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
    isCancelLoading,
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
    showCloseButton = type !== 'text',
    okButtonProps,
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
      isCentered
    >
      <ModalOverlay />
      <ModalContent borderRadius="24px" {...modalContentProps}>
        {showCloseButton ? <ModalCloseButton /> : null}
        <ModalBody {...modalBodyProps}>
          {content ?? (
            <Alert
              status={type === 'text' ? undefined : type}
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              bg="white"
            >
              {type !== 'text' ? (
                <AlertIcon
                  boxSize="70px"
                  mr={0}
                  mb={4}
                  {...(type === 'warning' ? { color: '#FFA940' } : {})}
                />
              ) : null}
              <AlertTitle mb={2} mx={0} fontSize="16px" fontWeight="normal">
                {title}
              </AlertTitle>
              <AlertDescription
                maxWidth="sm"
                fontSize="14px"
                color="gray.500"
                whiteSpace="pre-wrap"
              >
                {description}
              </AlertDescription>
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <Stack
            spacing={2}
            w="full"
            direction={type === 'text' ? 'row-reverse' : 'column'}
          >
            <Button
              isFullWidth
              variant="solid"
              colorScheme="primary"
              isLoading={isLoading}
              onClick={onConfirm}
              fontWeight="normal"
              {...okButtonProps}
            >
              {okText ?? t('common.actions.confirm')}
            </Button>

            {onCancel !== noop ? (
              <Button
                isFullWidth
                onClick={onCancel}
                fontWeight="normal"
                isLoading={isCancelLoading}
              >
                {cancelText ?? t('common.actions.cancel')}
              </Button>
            ) : null}
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
