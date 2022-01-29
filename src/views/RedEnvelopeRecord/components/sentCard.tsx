import { Box, Divider, Flex, Heading } from '@chakra-ui/react'
import { Button, Progress } from '@mibao-ui/components'
import { ReactComponent as RedEnvelopeShare } from '../../../assets/svg/red-envelope-share.svg'
import { RedEnvelopeState, SentRedEnvelopeRecordEvent } from '../../../models'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { RoutePath } from '../../../routes'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { CardImageGroup } from './cardImageGroup'

const StyledLink = styled(Link)`
  display: inline-flex;
  height: 100%;
`

const FlexImagesLink = styled(Link)`
  display: flex;
  width: 100%;
`

export const SentCard: React.FC<{
  data: SentRedEnvelopeRecordEvent
  onCloseEvent: (uuid: string) => void
}> = ({ data, onCloseEvent }) => {
  const { t } = useTranslation('translations')
  const isClosed =
    data.state === RedEnvelopeState.Closed ||
    data.state === RedEnvelopeState.Expired ||
    data.state === RedEnvelopeState.Done
  const statusText = useMemo(() => {
    switch (data.state) {
      case RedEnvelopeState.Closed:
        return t('red-envelope-records.state.closed')
      case RedEnvelopeState.Done:
        return t('red-envelope-records.state.done')
      case RedEnvelopeState.Expired:
        return t('red-envelope-records.state.expired')
      case RedEnvelopeState.Ongoing:
        return (
          <Box color="#FD6A3C" as="span">
            {t('red-envelope-records.state.ongoing')}
          </Box>
        )
    }
  }, [data.state, t])
  const progressValue = data
    ? Math.floor((data.progress.claimed / data.progress.total) * 100)
    : 0

  return (
    <Box
      shadow="0 0 8px rgba(0, 0, 0, 0.08)"
      rounded="22px"
      px="15px"
      py="10px"
      mb="10px"
      position="relative"
      bg="white"
    >
      <Box position="absolute" top="15px" right="15px">
        {isClosed ? (
          <RedEnvelopeShare style={{ filter: 'grayscale(1)' }} />
        ) : (
          <Link to={`${RoutePath.RedEnvelope}/${data.uuid}/share`}>
            <RedEnvelopeShare />
          </Link>
        )}
      </Box>
      <Heading fontSize="14px" fontWeight="bold" my="10px" h="18px">
        {data.greeting}
      </Heading>
      <FlexImagesLink to={`${RoutePath.RedEnvelope}/${data.uuid}/detail`}>
        <CardImageGroup
          items={data.tokens.map((token) => ({
            src: token.bg_image_url === null ? '' : token.bg_image_url,
            tid: token.n_token_id,
          }))}
          total={data.tokens_count}
        />
      </FlexImagesLink>

      <Box mt="10px" fontSize="12px">
        {t('red-envelope-records.progress')}
        {data.progress.claimed}/{data.progress.total}
      </Box>
      <Progress
        value={progressValue}
        colorScheme={isClosed ? 'gray' : 'process'}
        mb="15px"
        mt="5px"
        height="8px"
      />
      <Divider />
      <Flex mt="10px" fontSize="12px" h="25px" lineHeight="25px">
        <Box mr="auto" color="#777E90">
          {statusText}
        </Box>
        <StyledLink to={`${RoutePath.RedEnvelope}/${data.uuid}/detail`}>
          <Button colorScheme="black" size="small" px="10px">
            {t('red-envelope-records.details')}
          </Button>
        </StyledLink>
        {isClosed ? null : (
          <Button
            colorScheme="primary"
            size="small"
            px="10px"
            ml="10px"
            onClick={() => onCloseEvent(data.uuid)}
          >
            {t('red-envelope-records.close')}
          </Button>
        )}
      </Flex>
    </Box>
  )
}
