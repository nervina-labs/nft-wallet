import React, { useCallback } from 'react'
import { useToast as useChakraToast, UseToastOptions } from '@chakra-ui/react'
import { Center, Text, TextProps } from '@mibao-ui/components'

export interface ToastOptions extends UseToastOptions {
  textProps?: TextProps
}

export const useToast = () => {
  const toast = useChakraToast()
  return useCallback(
    (message: React.ReactNode, options?: ToastOptions) => {
      toast.closeAll()
      const { textProps, ...rest } = options ?? {}
      toast({
        duration: 1500,
        ...rest,
        render: () => (
          <Center position="relative" bottom={`${window.innerHeight / 2}px`}>
            <Text
              borderRadius="16px"
              px="40px"
              py="10px"
              fontSize="16px"
              color="white"
              bg="rgba(51, 51, 51, 0.7)"
              {...textProps}
            >
              {message}
            </Text>
          </Center>
        ),
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}
