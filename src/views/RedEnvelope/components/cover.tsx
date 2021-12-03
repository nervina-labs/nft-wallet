import { Box, Flex, Heading, Input } from '@chakra-ui/react'
import { Button } from '@mibao-ui/components'
import styled from '@emotion/styled'
import { useState } from 'react'

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
  isRiddle?: boolean
  open?: () => void
}

export const Cover: React.FC<CoverProps> = ({ isRiddle, open }) => {
  const [inputValue, setInputValue] = useState('')
  return (
    <Flex
      direction="column"
      textAlign="center"
      alignItems="center"
      px="40px"
      minH={isRiddle ? '500px' : '350px'}
      h="70%"
      flex="1"
    >
      <Heading fontSize="16px" color="white" mb="10px" mt="25px">
        您有一个数字藏品盲盒红包待领取
      </Heading>
      <Heading fontSize="24px" color="#F9E0B7">
        大吉大利，好运连连！
      </Heading>

      {isRiddle ? (
        <>
          <RiddleTitle mt="40px">谜题</RiddleTitle>
          <Heading fontSize="24px" color="white" mb="10px" mt="25px">
            恭喜发财
          </Heading>
          <RiddleTitle>谜底</RiddleTitle>
        </>
      ) : null}

      <Input
        placeholder={isRiddle ? '猜谜底，领数字藏品' : '输入红包口令立即领取'}
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
        mt={isRiddle ? '10px' : '30px'}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button
        isFullWidth
        mt="14px"
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
        onClick={open}
      >
        马上领取
      </Button>

      <Box color="white" fontSize="16px" mb="6px" mt="auto">
        领取秘宝盲盒红包
      </Box>
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
        当前帐号：test@nervina.io
      </Box>
    </Flex>
  )
}
