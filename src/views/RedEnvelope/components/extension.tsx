import {
  Center,
  Heading,
  HStack,
  useDisclosure,
  VStack,
  Text,
  Image,
} from '@chakra-ui/react'
import { ReactComponent as MyNftSvg } from '../../../assets/svg/red-envelope-icon/my-nft.svg'
import { ReactComponent as RedEnvelopeSvg } from '../../../assets/svg/red-envelope-icon/red-envelope.svg'
import { ReactComponent as FollowUsSvg } from '../../../assets/svg/red-envelope-icon/follow-us.svg'
import NervinaWxOfficialAccountQrcodePath from '../../../assets/img/nervina-wx-official-account-qrcode.jpg'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { RoutePath } from '../../../routes'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from '@mibao-ui/components'

export const Extension: React.FC<{ greeting?: string }> = ({ greeting }) => {
  const { t } = useTranslation('translations')
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Heading
        color="#F9E0B7"
        textAlign="center"
        fontSize="16px"
        mt="30px"
        h="25px"
      >
        {greeting}
      </Heading>
      <HStack fontSize="12px" color="white" mt="30px" spacing="35px">
        <Link to={RoutePath.NFTs}>
          <VStack>
            <Center rounded="18px" w="58px" h="58px" bg="white">
              <MyNftSvg />
            </Center>
            <Center>{t('red-envelope.icons.my-collections')}</Center>
          </VStack>
        </Link>
        <Link to={RoutePath.RedEnvelope}>
          <VStack>
            <Center rounded="18px" w="58px" h="58px" bg="white">
              <RedEnvelopeSvg />
            </Center>
            <Center>{t('red-envelope.icons.send-red-packet')}</Center>
          </VStack>
        </Link>
        <VStack onClick={onOpen}>
          <Center rounded="18px" w="58px" h="58px" bg="white">
            <FollowUsSvg />
          </Center>
          <Center>{t('red-envelope.icons.follow-us')}</Center>
        </VStack>
      </HStack>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent w="90%">
          <ModalCloseButton />
          <ModalBody pb="0">
            <Heading fontSize="20px" textAlign="center">
              Nervina Labs
            </Heading>
            <Image
              src={NervinaWxOfficialAccountQrcodePath}
              w="190px"
              h="190px"
              mx="auto"
              mt="22px"
            />
            <Text fontSize="12px" textAlign="center" mt="30px">
              {t('red-envelope.scan-code-followed-official-account')}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
