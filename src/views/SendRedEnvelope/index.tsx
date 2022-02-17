import { Appbar, AppbarButton } from '../../components/Appbar'
import { RainbowBackground } from '../../components/RainbowBackground'
import { ReactComponent as MoreSvg } from '../../assets/svg/more.svg'
import { ReactComponent as LeftSvg } from '../../assets/svg/left.svg'
import {
  Box,
  BoxProps,
  Button,
  Flex,
  VStack,
  Input,
  TabPanel,
  TabPanels,
  useDisclosure,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { Drawer, Tab, TabList, Tabs, Image } from '@mibao-ui/components'
import { useInnerSize } from '../../hooks/useInnerSize'
import { CONTAINER_MAX_WIDTH } from '../../constants'
import { NftListDrawer } from './components/nftListDrawer'
import { useCallback, useState } from 'react'
import { getNFTQueryParams, isSupportWebp, UnipassConfig } from '../../utils'
import { NFTToken } from '../../models'
import { useToast } from '../../hooks/useToast'
import { useTranslation } from 'react-i18next'
import { RoutePath } from '../../routes'
import { Redirect, useHistory } from 'react-router-dom'
import { useSendRedEnvelope } from './hooks/useSendRedEnvelope'
import { useAccountStatus } from '../../hooks/useAccount'

const formItemProps: BoxProps = {
  rounded: '8px',
  py: '12px',
  px: '15px',
  bg: 'white',
  mx: '20px',
  mb: '15px',
  fontSize: '16px',
}

const RightIcon = styled(LeftSvg)`
  width: 14px;
  height: 14px;
  position: absolute;
  top: calc(50% - 7px);
  transform: rotate(180deg);
  right: 10px;
`

const Container = styled(RainbowBackground)`
  height: auto;
  min-height: 100vh;
`

const TEXT_LIMIT = 20

export const SendRedEnvelope: React.FC = () => {
  const {
    isOpen: isOpenNftList,
    onOpen: onOpenNftList,
    onClose: onCloseNftList,
  } = useDisclosure()
  const {
    isOpen: isOpenMore,
    onOpen: onOpenMore,
    onClose: onCloseMore,
  } = useDisclosure()
  const { width } = useInnerSize()
  const modalLeft = `calc(50% - ${Math.min(width, CONTAINER_MAX_WIDTH) / 2}px)`
  const [selectedTokens, setSelectedTokens] = useState<NFTToken[]>([])
  const [rewardAmountValue, setRewardAmountValue] = useState('')
  const [greeting, setGreeting] = useState('')
  const [puzzleQuestion, setPuzzleQuestion] = useState('')
  const [puzzleAnswer, setPuzzleAnswer] = useState('')
  const [tabIndex, setTabIndex] = useState<number>(0)
  const toast = useToast()
  const { t, i18n } = useTranslation('translations')
  const { push } = useHistory()
  const { onSend, isSending } = useSendRedEnvelope()
  const { isLogined } = useAccountStatus()

  const limitNumberInput = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      currentValue: string,
      limit: number
    ) => {
      const { value } = e.currentTarget
      if (!value) {
        return ''
      }
      if (!/^\d*$/.test(value)) {
        return currentValue
      }
      const p = +value
      if (Number.isNaN(p) || p < 1) {
        return currentValue
      }
      if (p > limit) {
        return `${limit}`
      }
      return `${p}`
    },
    []
  )

  const onSubmit = useCallback(async () => {
    if (!selectedTokens.length) {
      toast(t('send-red-envelope.toast.not-nft'))
      return
    }
    if (!Number(rewardAmountValue)) {
      toast(t('send-red-envelope.toast.not-amount'))
      return
    }
    if (tabIndex === 1) {
      if (!puzzleQuestion) {
        toast(t('send-red-envelope.toast.not-puzzle-question'))
        return
      }
      if (!puzzleAnswer) {
        toast(t('send-red-envelope.toast.not-puzzle-answer'))
        return
      }
    }
    await onSend({
      greeting,
      rewardAmount: rewardAmountValue,
      tokenUuids: selectedTokens.map((t) => t.token_uuid),
      ...(tabIndex === 1
        ? {
            puzzleAnswer,
            puzzleQuestion,
          }
        : {}),
    })
  }, [
    greeting,
    onSend,
    puzzleAnswer,
    puzzleQuestion,
    rewardAmountValue,
    selectedTokens,
    t,
    tabIndex,
    toast,
  ])

  if (!isLogined) {
    UnipassConfig.setRedirectUri(location.pathname)
    return <Redirect to={RoutePath.Login} />
  }

  return (
    <Container>
      <Flex direction="column" position="relative" zIndex={2} h="full">
        <Appbar
          transparent
          title={t('send-red-envelope.title')}
          right={
            <AppbarButton transparent onClick={onOpenMore}>
              <MoreSvg />
            </AppbarButton>
          }
        />
        <Drawer
          placement="bottom"
          isOpen={isOpenMore}
          hasOverlay
          onClose={onCloseMore}
          rounded="lg"
          contentProps={{
            style: {
              left: `calc(${modalLeft} + 20px)`,
              bottom: '40px',
              width: 'calc(100% - 40px)',
              maxWidth: CONTAINER_MAX_WIDTH - 40 + 'px',
            },
            textAlign: 'center',
            borderRadius: '20px',
          }}
        >
          <Box
            h="50px"
            lineHeight="50px"
            borderBottom="1px solid #E1E1E1"
            fontSize="16px"
            onClick={() => push(RoutePath.RedEnvelopeRecord)}
          >
            {t('send-red-envelope.more-menus.records')}
          </Box>
          <Box h="50px" lineHeight="50px" fontSize="16px" onClick={onCloseMore}>
            {t('send-red-envelope.more-menus.cancel')}
          </Box>
        </Drawer>

        <NftListDrawer
          isOpen={isOpenNftList}
          onClose={onCloseNftList}
          onChange={async (tokens) => {
            await setSelectedTokens(tokens)
            const rewardAmount = Number(rewardAmountValue)
            if (!isNaN(rewardAmount) && rewardAmount > tokens.length) {
              setRewardAmountValue(`${tokens.length}`)
            }
          }}
          left={modalLeft}
        />
        <Tabs
          colorScheme="sendRedEnvelope"
          onChange={setTabIndex}
          index={tabIndex}
        >
          <TabList justifyContent="center" borderBottom="none" mb="25px">
            <Tab px="0" mr="40px" fontSize="14px">
              {t('send-red-envelope.red-envelope-type.normal')}
            </Tab>
            <Tab px="0" fontSize="14px">
              {t('send-red-envelope.red-envelope-type.puzzle')}
            </Tab>
          </TabList>
          <Box
            {...formItemProps}
            bg="rgba(255, 255, 255, 0.5)"
            rounded="8px"
            px="0"
            py="0"
          >
            <Box
              {...formItemProps}
              position="relative"
              onClick={onOpenNftList}
              mx="0"
            >
              {t('send-red-envelope.form-items.select-nft')}
              <RightIcon />
            </Box>

            {selectedTokens.length > 0 ? (
              <>
                <VStack px="10px" spacing="15px">
                  {selectedTokens.map((token, i) => (
                    <Box w="full" key={i}>
                      <Flex key={i} justify="flex-start" w="full">
                        <Image
                          src={token.class_bg_image_url}
                          w="58px"
                          minW="58px"
                          h="58px"
                          rounded="16px"
                          webp={isSupportWebp()}
                          resizeScale={300}
                          customizedSize={{
                            fixed: 'large',
                          }}
                          srcQueryParams={getNFTQueryParams(
                            token.n_token_id,
                            i18n.language
                          )}
                        />
                        <Flex
                          pl="10px"
                          direction="column"
                          justify="center"
                          fontSize="14px"
                          w="calc(100% - 58px)"
                        >
                          <Box
                            whiteSpace="nowrap"
                            textOverflow="ellipsis"
                            overflow="hidden"
                          >
                            {token.class_name}
                          </Box>
                          <Box
                            fontSize="12px"
                            color="#777E90"
                            whiteSpace="nowrap"
                            textOverflow="ellipsis"
                            overflow="hidden"
                          >
                            {token.issuer_name}
                          </Box>
                        </Flex>
                      </Flex>
                      <Box color="#777E90" fontSize="14px" mt="5px">
                        #{token.n_token_id}
                      </Box>
                    </Box>
                  ))}
                </VStack>
                <Box
                  color="#FF5C00"
                  px="10px"
                  pb="15px"
                  pt="10px"
                  w="full"
                  textAlign="right"
                  fontSize="12px"
                >
                  {t('send-red-envelope.form-items.total', {
                    total: selectedTokens.length,
                  })}
                </Box>
              </>
            ) : null}
          </Box>

          <Flex {...formItemProps} justify="space-between" whiteSpace="nowrap">
            <Box>{t('send-red-envelope.form-items.reward-amount')}</Box>
            <Flex>
              <Input
                bg="rgba(0, 0, 0, 0)"
                placeholder={t(
                  'send-red-envelope.form-items.reward-amount-placeholder'
                )}
                border="none"
                h="24px"
                px="0"
                pr="5px"
                textAlign="right"
                _focus={{
                  border: 'none',
                }}
                value={rewardAmountValue}
                onChange={(e) =>
                  setRewardAmountValue(
                    limitNumberInput(
                      e,
                      rewardAmountValue,
                      selectedTokens.length
                    )
                  )
                }
              />
              {t('send-red-envelope.form-items.pcs')}
            </Flex>
          </Flex>
          <Flex {...formItemProps} justify="space-between" whiteSpace="nowrap">
            <Box>{t('send-red-envelope.form-items.greeting')}</Box>
            <Input
              placeholder={t(
                'send-red-envelope.form-items.greeting-placeholder'
              )}
              w="full"
              border="none"
              px="0"
              h="24px"
              ml="24px"
              textAlign="right"
              _focus={{
                border: 'none',
              }}
              value={greeting}
              onChange={(e) => setGreeting(e.target?.value)}
              maxLength={TEXT_LIMIT}
            />
          </Flex>
          <TabPanels>
            <TabPanel p="0"></TabPanel>
            <TabPanel {...formItemProps} pt="20px">
              <Box color="#777E90" fontSize="12px" mb="4px">
                {t('send-red-envelope.form-items.puzzle-question-field')}
              </Box>
              <Input
                bg="#EFEFEF"
                fontSize="18px"
                size="lg"
                textAlign="center"
                border="1px solid #E8E8E8"
                outline="none"
                rounded="8px"
                _focus={{
                  border: '1px solid #E8E8E8',
                  outline: 'none',
                }}
                placeholder={t(
                  'send-red-envelope.form-items.puzzle-question-placeholder'
                )}
                value={puzzleQuestion}
                onChange={(e) => setPuzzleQuestion(e.target?.value)}
                maxLength={TEXT_LIMIT}
              />
              <Box color="#777E90" fontSize="12px" mb="4px" mt="16px">
                {t('send-red-envelope.form-items.puzzle-answer-field')}
              </Box>
              <Input
                bg="#EFEFEF"
                fontSize="18px"
                size="lg"
                textAlign="center"
                border="1px solid #E8E8E8"
                outline="none"
                rounded="8px"
                _focus={{
                  border: '1px solid #E8E8E8',
                  outline: 'none',
                }}
                placeholder={t(
                  'send-red-envelope.form-items.puzzle-answer-placeholder'
                )}
                value={puzzleAnswer}
                onChange={(e) => setPuzzleAnswer(e.target?.value)}
                maxLength={TEXT_LIMIT}
              />
              <Box color="#777E90" fontSize="12px" mt="8px" textAlign="center">
                {t('send-red-envelope.form-items.puzzle-prompt')}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Button
          colorScheme="primary"
          isFullWidth
          mx="20px"
          w="calc(100% - 40px)"
          h="48px"
          mt="auto"
          mb="30px"
          onClick={onSubmit}
          isLoading={isSending}
        >
          {t('send-red-envelope.form-items.submit')}
        </Button>
      </Flex>
    </Container>
  )
}
