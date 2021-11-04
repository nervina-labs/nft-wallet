import React, { useMemo, useRef } from 'react'
// import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useWidth } from '../../hooks/useWidth'
import { CONTAINER_MAX_WIDTH } from '../../constants'
import { Drawer } from '@mibao-ui/components'
import {
  isDrawerOpenAtom,
  OrderStep,
  useOrderStep,
  useResetOrderState,
} from '../../hooks/useOrder'
import { InitOrder } from './InitOrder'
import { SelectPayment } from './SelectPayment'
import { ConfirmPayment } from './ConfirmPayment'
import { useAtom } from 'jotai'
import { Reselect } from './Reselect'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'
import { Trans, useTranslation } from 'react-i18next'
import { noop } from '../../utils'

const DrawerContainer = styled.div`
  display: flex;
  flex-direction: column;
  .footer {
    position: fixed;
    bottom: 20px;
    display: flex;
    justify-content: center;
    width: calc(100% - 48px);
    max-width: 500px;
  }
`

const Comps: Record<OrderStep, React.FC> = {
  [OrderStep.Init]: InitOrder,
  [OrderStep.PaymentChannel]: SelectPayment,
  [OrderStep.ConfirmOrder]: ConfirmPayment,
  [OrderStep.Reselect]: Reselect,
}

export const OrderDrawer: React.FC = () => {
  const bodyRef = useRef(document.body)
  const bodyWidth = useWidth(bodyRef)

  const drawerLeft = useMemo(() => {
    if (bodyWidth == null) {
      return 0
    }
    if (bodyWidth <= CONTAINER_MAX_WIDTH) {
      return 0
    }
    return `${(bodyWidth - CONTAINER_MAX_WIDTH) / 2}px`
  }, [bodyWidth])

  const step = useOrderStep()

  const CurrentComp = Comps[step]

  const [isOpen, setOpen] = useAtom(isDrawerOpenAtom)
  const resetOrder = useResetOrderState()
  const confirmDialog = useConfirmDialog()
  const [t] = useTranslation('translations')
  return (
    <Drawer
      placement="bottom"
      isOpen={isOpen}
      hasOverlay
      onClose={() => {
        if (step > 1) {
          confirmDialog({
            type: 'warning',
            title: t('orders.dialog.cancel-title'),
            description: (
              <Trans
                ns="translations"
                i18nKey="orders.dialog.cancel-desc"
                t={t}
                components={{
                  b: <b style={{ color: '#5065E5', fontWeight: 'normal' }}></b>,
                }}
              />
            ),
            okText: t('orders.dialog.cancel-confirm'),
            cancelText: t('orders.dialog.cancel-quit'),
            onConfirm: noop,
            onCancel() {
              resetOrder()
              setOpen(false)
            },
          })
        } else {
          resetOrder()
          setOpen(false)
        }
      }}
      rounded="lg"
      autoFocus={false}
      contentProps={{
        width: drawerLeft === 0 ? '100%' : `${CONTAINER_MAX_WIDTH}px`,
        style: {
          left: drawerLeft,
        },
        height: '350px',
        borderRadius: '20px',
        borderBottomRadius: 0,
      }}
    >
      <DrawerContainer>
        <CurrentComp />
      </DrawerContainer>
    </Drawer>
  )
}
