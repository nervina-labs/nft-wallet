import { useQuery } from 'react-query'
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js'
import { Autoplay, Pagination } from 'swiper'
import { useAPI } from '../../../hooks/useAccount'
import { Query } from '../../../models'
import { Image, Grid, Skeleton, GridItem } from '@mibao-ui/components'
import styled from '@emotion/styled'
import { useCallback } from 'react'

const Container = styled.div`
  .swiper {
    height: 200px;

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
  const gotoLink = useCallback((link: string) => {
    return () => {
      if (link) {
        window.location.href = link
      }
    }
  }, [])

  const banners = data?.['Notification::Banner']

  return (
    <Container>
      <Skeleton isLoaded={!isLoading} w="full">
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
        >
          {banners?.map((banner, i) => (
            <SwiperSlide key={i}>
              <a
                onClick={(e) => e.stopPropagation()}
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
      </Skeleton>

      <Grid
        templateColumns="repeat(2, 1fr)"
        h="190px"
        w="full"
        py="10px"
        px="20px"
        gap="10px"
      >
        {data?.['Notification::News']?.[0] ? (
          <GridItem
            rowSpan={2}
            colSpan={1}
            overflow="hidden"
            rounded="22px"
            roundedBottomRight="0"
            onClick={gotoLink(data['Notification::News'][0].link)}
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
            onClick={gotoLink(data['Notification::Interview'][0].link)}
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
            onClick={gotoLink(data['Notification::Activity'][0]?.link)}
          >
            <Image
              src={data['Notification::Activity'][0].content}
              w="full"
              h="full"
            />
          </GridItem>
        ) : null}
      </Grid>
    </Container>
  )
}
