import { useQuery } from 'react-query'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'
import 'swiper/components/pagination/pagination.min.css'
import { useAPI } from '../../../hooks/useAccount'
import { Query } from '../../../models'
import styled from 'styled-components'
import { Skeleton } from '@mibao-ui/components'

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
      border-radius: 4px;
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

  const banners = data?.['Notification::Banner']

  return (
    <Container>
      <Skeleton isLoaded={!isLoading} w="full">
        <Swiper
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
              ></a>
            </SwiperSlide>
          ))}
        </Swiper>
      </Skeleton>
    </Container>
  )
}
