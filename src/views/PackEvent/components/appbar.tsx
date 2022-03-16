import {
  AppbarButton,
  AppbarSticky,
  Appbar as RowAppbar,
} from '../../../components/Appbar'
import { useShareDisclosure } from '../../../hooks/useShareDisclosure'
import { PackEventDetailResponse } from '../../../models/pack-event'
import { ReactComponent as ShareSvg } from '../../../assets/svg/share.svg'
import { Suspense } from 'react'
import Share from '../../../components/Share'
import { PackEventPoster } from '../../../components/PackEventPoster'

export const Appbar: React.FC<{
  data?: PackEventDetailResponse
  id: string
}> = ({ data, id }) => {
  const {
    isOpenShare,
    onOpenShare,
    onCloseShare,
    neverOpened,
  } = useShareDisclosure()

  return (
    <>
      <AppbarSticky position="fixed">
        <RowAppbar
          transparent
          right={
            <AppbarButton
              transparent
              onClick={() => {
                onOpenShare()
              }}
            >
              <ShareSvg />
            </AppbarButton>
          }
        />
      </AppbarSticky>
      {data && !neverOpened ? (
        <Suspense fallback={null}>
          <Share
            isOpen={isOpenShare}
            onClose={onCloseShare}
            shareUrl={`${window.location.origin}/RoutePath.PackEvent/${id}`}
            poster={(onLoaded) => (
              <PackEventPoster
                onLoaded={onLoaded}
                data={data}
                shareUrl={`${window.location.origin}/RoutePath.PackEvent/${id}`}
              />
            )}
          />
        </Suspense>
      ) : null}
    </>
  )
}
