import styled from '@emotion/styled'
import {
  Box,
  Divider,
  Flex,
  Heading,
  Image,
  VStack,
} from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import { Appbar, AppbarSticky } from '../../components/Appbar'
import { useAPI } from '../../hooks/useAccount'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { Query } from '../../models'
import { MainContainer } from '../../styles'
import { formatTime, getNFTQueryParams, isSupportWebp } from '../../utils'

const FlexImageItemLink = styled(Link)`
  width: 100%;
`

export const RedEnvelopeReceived: React.FC = () => {
  const { t, i18n } = useTranslation('translations')
  const { id } = useParams<{ id: string }>()
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const { data } = useQuery([Query.GetRedEnvelopeReceived], async () => {
    const auth = await getAuth()
    const { data } = await api.getReceivedRedEnvelopeDetail(id, auth)
    return data
  })
  const time = data?.created_at
    ? formatTime(`${new Date().getTime()}`, i18n.language)
    : '----:--:--'

  return (
    <MainContainer
      bg="linear-gradient(180deg, #F7F7F7 0%, #FFFFFF 100%)"
      minH="100vh"
    >
      <AppbarSticky>
        <Appbar title={t('red-envelope-detail.title')} />
      </AppbarSticky>

      <Box rounded="22px" m="20px" bg="white" px="15px">
        <Heading h="45px" fontSize="16px" lineHeight="45px">
          {t('red-envelope-detail.collections-received')}
        </Heading>
        <Divider mb="16px" />
        <VStack spacing="12px">
          {data?.record_items.map((item, i) => (
            <FlexImageItemLink key={i} to={`/nft/${item.uuid}`}>
              <Image
                src={item.bg_image_url === null ? '' : item.bg_image_url}
                resizeScale={300}
                webp={isSupportWebp()}
                customizedSize={{
                  fixed: 'large',
                }}
                srcQueryParams={getNFTQueryParams(
                  item.n_token_id,
                  i18n.language
                )}
                w="50px"
                h="50px"
                rounded="16px"
              />
              <Flex
                justify="center"
                fontSize="14px"
                ml="10px"
                mr="auto"
                direction="column"
              >
                <Box
                  color="#000"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  overflow="hidden"
                >
                  {item.name}
                </Box>
                <Box
                  fontSize="12px"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  overflow="hidden"
                >
                  #{item.n_token_id}
                </Box>
              </Flex>
            </FlexImageItemLink>
          ))}
        </VStack>
        <Divider mt="12px" />
        <Box h="43px" lineHeight="43px" fontSize="12px" color="#777E90">
          {t('red-envelope-detail.received-time')}
          {time}
        </Box>
      </Box>
    </MainContainer>
  )
}
