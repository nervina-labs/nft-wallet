import { Box, Flex, Heading, Input } from '@chakra-ui/react'
import { Button } from '@mibao-ui/components'
import styled from '@emotion/styled'
import { useCallback, useState } from 'react'
import { RedEnvelopeResponse, RuleType } from '../../../models'
import { useAccountStatus, useAPI } from '../../../hooks/useAccount'
import { useTranslation } from 'react-i18next'
import { useGetAndSetAuth } from '../../../hooks/useProfile'
import { useToast } from '../../../hooks/useToast'
import { AxiosError } from 'axios'
import { useHistory } from 'react-router-dom'
import { RoutePath } from '../../../routes'
import { UnipassConfig } from '../../../utils'

const RiddleTitle = styled(Flex)`
  ::before,
  ::after {
    content: ' ';
    display: block;
    width: 28px;
    height: 1px;
    margin: auto 6px;
    background-color: white;
  }

  font-size: 12px;
  color: white;
`

export interface CoverProps {
  data?: RedEnvelopeResponse
  address: string
  uuid: string
  email?: string
  opening?: boolean
  onOpen?: () => void
}

export const Cover: React.FC<CoverProps> = ({
  address,
  uuid,
  data,
  email,
  opening,
  onOpen,
}) => {
  const { t } = useTranslation('translations')
  const [inputValue, setInputValue] = useState('')
  const isPuzzle = data?.rule_info?.rule_type === RuleType.puzzle
  const getAuth = useGetAndSetAuth()
  const { isLogined } = useAccountStatus()
  const api = useAPI()
  const toast = useToast()
  const { push } = useHistory()

  const onOpenTheRedEnvelope = useCallback(async () => {
    if (!isLogined) {
      UnipassConfig.setRedirectUri(location.pathname)
      push(RoutePath.Login)
      return
    }
    const auth = await getAuth()
    await api
      .openRedEnvelopeEvent(uuid, address, auth, {
        input: inputValue,
      })
      .catch((err: AxiosError) => {
        if (data?.rule_info?.rule_type === RuleType.password) {
          toast(t('red-envelope.error-password'))
        } else if (data?.rule_info?.rule_type === RuleType.puzzle) {
          toast(t('red-envelope.error-puzzle'))
        } else if (err.response?.status === 400) {
          toast(t('red-envelope.error-conditions'))
        }
        return err
      })
    onOpen?.()
  }, [
    address,
    api,
    data?.rule_info?.rule_type,
    getAuth,
    inputValue,
    isLogined,
    onOpen,
    push,
    t,
    toast,
    uuid,
  ])

  return (
    <Flex
      direction="column"
      textAlign="center"
      alignItems="center"
      px="40px"
      minH={isPuzzle ? '500px' : '350px'}
      h="70%"
      flex="1"
    >
      <Heading fontSize="16px" color="white" mb="10px" mt="25px">
        {t('red-envelope.title-1')}
      </Heading>
      <Heading
        fontSize="24px"
        color="#F9E0B7"
        textOverflow="ellipsis"
        noOfLines={2}
      >
        {data?.greegings}
      </Heading>

      {data?.rule_info?.rule_type === RuleType.puzzle ? (
        <>
          <RiddleTitle mt="40px">{t('red-envelope.puzzle-title')}</RiddleTitle>
          <Heading fontSize="24px" color="white" mb="10px" mt="25px">
            {data?.rule_info.question}
          </Heading>
          <RiddleTitle>{t('red-envelope.puzzle-answer')}</RiddleTitle>
        </>
      ) : null}

      {data?.rule_info !== null ? (
        <Input
          placeholder={
            isPuzzle
              ? t('red-envelope.puzzle-placeholder')
              : t('red-envelope.password-placeholder')
          }
          textAlign="center"
          bg="white"
          outline="none"
          _focus={{
            outline: 'none',
          }}
          _placeholder={{
            color: 'rgba(119, 126, 144, 0.5)',
          }}
          fontSize="16px"
          size="lg"
          mt={isPuzzle ? '10px' : '30px'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      ) : null}

      <Button
        isFullWidth
        mt={data?.rule_info !== null ? '14px' : '30px'}
        color="#F9E0B7"
        borderColor="#F9E0B7"
        _hover={{
          bg: 'rgba(0, 0, 0, 0.1)',
        }}
        _active={{
          bg: 'rgba(0, 0, 0, 0.2)',
          transition: '0s',
        }}
        size="lg"
        fontSize="16px"
        onClick={onOpenTheRedEnvelope}
        isLoading={opening}
      >
        {t('red-envelope.submit')}
      </Button>
      <Box color="white" fontSize="16px" mb="6px" mt="auto">
        {t('red-envelope.bottom-text')}
      </Box>
      {email ? (
        <Box
          border="1px solid #F9E0B7"
          color="#F9E0B7"
          rounded="50px"
          lineHeight="28px"
          h="28px"
          px="10px"
          fontSize="12px"
          mb="calc(10px + var(--safe-area-inset-bottom))"
        >
          {t('red-envelope.current-account')} {email}
        </Box>
      ) : null}
    </Flex>
  )
}
