import styled from 'styled-components'
import { LazyLoadImage } from '../../components/Image'
import { getImagePreviewUrl } from '../../utils'
import FallbackImg from '../../assets/svg/fallback.svg'

export interface MediaProps {
  src: string
  width?: number
}

const MediaContainer = styled.div`
  position: relative;
  border-radius: 8px;
  margin-right: 4px;
  overflow: hidden;
  .player {
    position: absolute;
    right: 6px;
    bottom: 6px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 20px;
      height: 20px;
    }
  }
`

export const Media: React.FC<MediaProps> = ({ src, width = 70 }) => {
  return (
    <MediaContainer style={{ minWidth: `${width}px` }}>
      <LazyLoadImage
        src={getImagePreviewUrl(src)}
        width={width}
        height={width}
        skeletonStyle={{ borderRadius: '8px' }}
        cover={true}
        imageStyle={{ borderRadius: '8px' }}
        disableContextMenu={true}
        backup={
          <LazyLoadImage
            skeletonStyle={{ borderRadius: '8px' }}
            width={width}
            cover
            height={width}
            src={FallbackImg}
          />
        }
      />
    </MediaContainer>
  )
}
