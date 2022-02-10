import { Box, Flex, Heading, Input } from '@chakra-ui/react'
import { Button } from '@mibao-ui/components'
import styled from '@emotion/styled'
import { useState } from 'react'
import {
  RedEnvelopeResponse,
  RedEnvelopeState,
  RuleType,
} from '../../../models'
import { useTranslation } from 'react-i18next'
import { ellipsisString } from '../../../utils'

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

export interface OnOpenOptions {
  input?: string
}

export interface CoverProps {
  data?: RedEnvelopeResponse
  address: string
  isOpening?: boolean
  onOpen?: (options?: OnOpenOptions) => void
  isLogined?: boolean
}

export const Cover: React.FC<CoverProps> = ({
  address,
  data,
  isOpening,
  onOpen,
  isLogined,
}) => {
  const { t } = useTranslation('translations')
  const [inputValue, setInputValue] = useState('')
  const isPuzzle = data?.rule_info?.rule_type === RuleType.puzzle

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
        {data?.rule_info?.rule_type === RuleType.puzzle
          ? t('red-envelope.title-riddle')
          : t('red-envelope.title-normal')}
      </Heading>
      <Heading
        fontSize="24px"
        color="#F9E0B7"
        textOverflow="ellipsis"
        noOfLines={2}
      >
        {data?.greetings}
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
          disabled={!isLogined}
        />
      ) : null}

      {data?.state === RedEnvelopeState.Pending ? (
        <Box textAlign="center" fontSize="16px" my="50px" color="white">
          <Box fontSize="36px">😉</Box>
          {t('red-envelope.generating')}
        </Box>
      ) : (
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
          onClick={() => onOpen?.({ input: inputValue })}
          isLoading={isOpening}
        >
          {isLogined
            ? t('red-envelope.submit')
            : t('red-envelope.connect-and-open-it')}
        </Button>
      )}

      <Box color="white" fontSize="16px" mb="6px" mt="auto">
        {t('red-envelope.bottom-text')}
      </Box>
      <Box h="28px" mb="calc(30px + var(--safe-area-inset-bottom))">
        {address ? (
          <Box
            border="1px solid #F9E0B7"
            color="#F9E0B7"
            rounded="50px"
            lineHeight="28px"
            h="28px"
            px="10px"
            fontSize="12px"
            whiteSpace="nowrap"
          >
            {t('red-envelope.current-account')}{' '}
            {ellipsisString(address, [11, 8])}
          </Box>
        ) : null}
      </Box>
    </Flex>
  )
}
