import {
  AspectRatio,
  Box,
  Image,
  ListItem,
  OrderedList,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { useLayoutEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { RainbowBackground } from '../../components/RainbowBackground'
import { useHtml2Canvas } from '../../hooks/useHtml2Canvas'
import DEFAULT_RED_ENVELOPE_COVER_PATH from '../../assets/svg/share-red-envelope-cover.svg'
import styled from '@emotion/styled'
import QRCode from 'qrcode.react'
import { AppbarSticky, Appbar } from '../../components/Appbar'
import {
  Button,
  Image as MibaoImage,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
} from '@mibao-ui/components'
import { useAPI } from '../../hooks/useAccount'
import { useQuery } from 'react-query'
import { Query, RuleType } from '../../models'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { RoutePath } from '../../routes'
import { useTranslation } from 'react-i18next'

const Container = styled(RainbowBackground)`
  height: auto;
  min-height: 100vh;
  align-items: center;
  display: flex;
  flex-direction: column;
`

export const ShareRedEnvelope: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { onRender, imgSrc } = useHtml2Canvas()
  const sharePosterRef = useRef<HTMLDivElement>(null)
  const {
    isOpen: isOpenCopySucceedDialog,
    onOpen: onOpenCopySucceedDialog,
    onClose: onCloseCopySucceedDialog,
  } = useDisclosure()
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const { t } = useTranslation('translations')

  const { data, isLoading } = useQuery(
    [Query.GetRedEnvelopeDetail, id],
    async () => {
      const auth = await getAuth()
      const { data } = await api.getRedEnvelopeDetail(id, auth)
      return data
    }
  )

  useLayoutEffect(() => {
    if (sharePosterRef.current && !isLoading && data) {
      onRender(sharePosterRef.current)
    }
  }, [id, isLoading, onRender, data])

  const shareUrl = `${location.origin}${RoutePath.RedEnvelope}/${id}`

  return (
    <Container>
      <AppbarSticky position="relative" zIndex={1}>
        <Appbar title={t('share-red-envelope.title')} transparent />
      </AppbarSticky>
      <Box
        opacity="0"
        w="0"
        h="0"
        pointerEvents="none"
        position="fixed"
        top="0"
        left="0"
      >
        <Box
          w="375px"
          h="564px"
          mx="auto"
          position="fixed"
          zIndex={2}
          bg="#E15F4C"
          ref={sharePosterRef}
        >
          <Box w="full" h="full">
            <Box w="full" h="full">
              <Image
                src={DEFAULT_RED_ENVELOPE_COVER_PATH}
                position="absolute"
                w="full"
                h="auto"
                top="0"
                left="0"
                zIndex={0}
                objectFit="cover"
              />
              <AspectRatio
                rounded="20px"
                bg="#EA5A5A"
                border="1px solid #F9E0B7"
                w="34%"
                ratio={1 / 1}
                position="absolute"
                left="50%"
                top="30%"
                transform="translateX(-50%)"
              >
                <Box p="15px">
                  <QRCode
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    fgColor="#F9E0B7"
                    bgColor="rgba(0, 0, 0, 0)"
                    value={shareUrl}
                  />
                </Box>
              </AspectRatio>
              <VStack
                position="absolute"
                top="55%"
                transform="translateX(-50%)"
                left="50%"
                w="full"
                color="#F9E0B7"
              >
                <Box
                  whiteSpace="nowrap"
                  color="white"
                  fontSize="12px"
                  style={{
                    overflow: 'initial',
                  }}
                >
                  {t('share-red-envelope.qrcode-prompt')}
                </Box>
                <Box
                  fontSize="24px"
                  w="calc(100% - 20px)"
                  textAlign="center"
                  mt="20px"
                >
                  {data?.greetings}
                </Box>
                {data?.rule_info?.rule_type === RuleType.puzzle ? (
                  <>
                    <Box fontSize="14px" mt="20px">
                      {t('share-red-envelope.puzzle-prompt')}
                    </Box>
                    <Box color="white" fontSize="20px" mt="6px">
                      {data?.rule_info.question}
                    </Box>
                  </>
                ) : null}
              </VStack>
            </Box>
          </Box>
        </Box>
      </Box>

      <AspectRatio
        ratio={375 / 564}
        w="calc(100% - calc(47px * 2))"
        position="relative"
        zIndex={1}
        mx="auto"
        mt="20px"
      >
        <MibaoImage src={imgSrc} />
      </AspectRatio>

      <Box fontSize="14px" my="24px" w="full" textAlign="center" px="20px">
        {t('share-red-envelope.save-image')}
      </Box>

      <Box fontSize="12px" mt="auto" mb="32px" color="#777e90" px="20px">
        <Box as="span" color="#CAA255">
          {t('share-red-envelope.wait-text')}
        </Box>
        <OrderedList>
          <ListItem>{t('share-red-envelope.prompt-list.0')}</ListItem>
          <ListItem>{t('share-red-envelope.prompt-list.1')}</ListItem>
        </OrderedList>
      </Box>

      <Button
        colorScheme="primary"
        w="calc(100% - 40px)"
        mx="auto"
        mb="calc(20px - var(--safe-area-inset-bottom))"
        size="lg"
        variant="solid"
        onClick={onOpenCopySucceedDialog}
      >
        {t('share-red-envelope.share-link')}
      </Button>

      <Modal
        onClose={onCloseCopySucceedDialog}
        isOpen={isOpenCopySucceedDialog}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          maxW="sm"
          style={{
            width: 'calc(100% - 40px)',
          }}
        >
          <ModalHeader textAlign="center" mt="32px">
            {t('share-red-envelope.copied-title')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py="0" mt="20px">
            <Box fontSize="14px" textAlign="center">
              {t('share-red-envelope.copied-text')}
            </Box>
            <Box
              bg="#F6F9FC"
              color="primary.600"
              p="16px"
              fontSize="12px"
              textAlign="center"
              mt="6px"
            >
              {shareUrl}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  )
}
