import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Banner, Announcement } from '../../models/banner'
import 'swiper/swiper.min.css'
import 'swiper/components/pagination/pagination.min.css'
import styled from 'styled-components'
import SwiperCore, { Pagination, Autoplay } from 'swiper/core'
import Marquee from 'react-fast-marquee'
import { ReactComponent as Trumpet } from '../../assets/svg/trumpet.svg'
import { Skeleton } from '@material-ui/lab'

SwiperCore.use([Pagination, Autoplay])

export interface BannerProps {
  banners?: Banner[]
  announcements?: Announcement[]
  isLoading?: boolean
}

const Container = styled.div`
  padding-right: 16px;
  .swiper {
    width: 100%;
    margin-bottom: 8px;
    .swiper-pagination-bullet-active {
      background: rgba(69, 69, 69, 0.5);
    }
    .slide {
      a {
        background-size: auto 100%;
        background-position: center 0;
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 4px;
      }
    }
  }

  .announcement {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .content {
      margin-left: 10px;
      flex: 1;
      a {
        color: #ff8201;
        font-size: 12px;
        margin-right: 8px;
      }
    }
  }
`

const ScrollText: React.FC<Pick<BannerProps, 'announcements'>> = ({
  announcements,
}) => {
  return (
    <div className="announcement">
      <div className="icon">
        <Trumpet />
      </div>
      <Marquee
        className="content"
        pauseOnHover={false}
        pauseOnClick={false}
        gradient={false}
        speed={50}
      >
        {announcements?.map((a) => {
          return (
            <a
              target="_blank"
              style={{
                textDecoration: 'none',
              }}
              rel="noopener noreferrer"
              href={a.link}
            >
              {a.content}
            </a>
          )
        })}
      </Marquee>
    </div>
  )
}

export const Notifications: React.FC<BannerProps> = ({
  banners,
  announcements,
}) => {
  const sliderHeight = `${
    (((window.innerWidth > 500 ? 500 : window.innerWidth) - 32) / 7) * 3
  }px`
  return (
    <Container>
      {Array.isArray(banners) ? (
        <Swiper
          className="swiper"
          pagination={{ clickable: true }}
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {banners.map((banner) => {
            return (
              <SwiperSlide
                key={banner.id}
                className="slide"
                style={{
                  height: sliderHeight,
                }}
              >
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
            )
          })}
        </Swiper>
      ) : (
        <Skeleton variant="rect" width="100%" height={sliderHeight} />
      )}
      {Array.isArray(announcements) ? (
        <ScrollText announcements={announcements} />
      ) : null}
    </Container>
  )
}
