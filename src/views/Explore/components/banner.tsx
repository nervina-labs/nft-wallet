import { useQuery } from 'react-query'
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js'
import { Autoplay, Pagination } from 'swiper'
import { useAPI } from '../../../hooks/useAccount'
import { Query } from '../../../models'
import {
  Image,
  Grid,
  Skeleton,
  GridItem,
  AspectRatio,
  Box,
} from '@mibao-ui/components'
import styled from '@emotion/styled'
import { useCallback } from 'react'
import { useTrackClick } from '../../../hooks/useTrack'

const Container = styled.div`
  .swiper {
    height: 100%;

    a {
      display: block;
      width: 100%;
      height: 100%;
      background-size: auto 100%;
      background-position: center 0;
      background-repeat: no-repeat;
    }
  }
`

export const Banner: React.FC = () => {
  const api = useAPI()
  const { data, isLoading } = useQuery(
    [Query.Notifications, api],
    async () => {
      const { data } = await api.getNotifications()
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  const trackGoLink = useTrackClick('explore-banner', 'click')
  const trackSwiperSlide = useTrackClick('explore-slider', 'didmount')
  const trackSwiperClick = useTrackClick('explore-slider', 'click')
  const gotoLink = useCallback(
    (link: string, n: number) => {
      return () => {
        if (link) {
          window.location.href = link
          trackGoLink(n)
        }
      }
    },
    [trackGoLink]
  )

  const banners = data?.['Notification::Banner']

  return (
    <Container>
      <Skeleton isLoaded={!isLoading} w="full">
        <AspectRatio ratio={385 / 200}>
          <Swiper
            modules={[Autoplay, Pagination]}
            navigation={false}
            className="swiper"
            pagination={{ clickable: true }}
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            onSlideChange={(s) => {
              trackSwiperSlide(s.realIndex + 1)
            }}
          >
            {banners?.map((banner, i) => (
              <SwiperSlide key={i}>
                <a
                  onClick={(e) => {
                    e.stopPropagation()
                    trackSwiperClick(i)
                  }}
                  target="_blank"
                  style={{
                    textDecoration: 'none',
                    backgroundImage: `url(${banner.content})`,
                  }}
                  rel="noopener noreferrer"
                  href={banner.link}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </AspectRatio>
      </Skeleton>

      <AspectRatio ratio={336 / 148}>
        <Box py="10px" px="20px">
          <Grid templateColumns="repeat(2, 1fr)" w="full" h="full" gap="10px">
            {data?.['Notification::News']?.[0] ? (
              <GridItem
                rowSpan={2}
                colSpan={1}
                overflow="hidden"
                rounded="22px"
                roundedBottomRight="0"
                onClick={gotoLink(data['Notification::News'][0].link, 1)}
              >
                <Image
                  src={data['Notification::News'][0].content}
                  w="full"
                  h="full"
                />
              </GridItem>
            ) : null}

            {data?.['Notification::Interview']?.[0] ? (
              <GridItem
                rowSpan={1}
                colSpan={1}
                overflow="hidden"
                rounded="22px"
                roundedTopLeft="0"
                onClick={gotoLink(data['Notification::Interview'][0].link, 2)}
              >
                <Image
                  src={data['Notification::Interview'][0].content}
                  w="full"
                  h="full"
                />
              </GridItem>
            ) : null}

            {data?.['Notification::Activity']?.[0] ? (
              <GridItem
                rowSpan={1}
                colSpan={1}
                overflow="hidden"
                rounded="22px"
                roundedBottomLeft="0"
                onClick={gotoLink(data['Notification::Activity'][0]?.link, 3)}
              >
                <Image
                  src={data['Notification::Activity'][0].content}
                  w="full"
                  h="full"
                />
              </GridItem>
            ) : null}
          </Grid>
        </Box>
      </AspectRatio>
    </Container>
  )
}
