import React, { useMemo, useRef } from 'react'
import { Center, Text, Link } from '@mibao-ui/components'
import styled from '@emotion/styled'
import { ReactComponent as ContactIcon } from '../../assets/svg/contact.svg'
import { useWidth } from '../../hooks/useWidth'
import { CONTACT_ADDRESS, CONTAINER_MAX_WIDTH } from '../../constants'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'
import { useTranslation } from 'react-i18next'
import * as clipboard from 'clipboard-polyfill/text'
import { useToast } from '../../hooks/useToast'

const Container = styled(Center)`
  background: linear-gradient(
    51.27deg,
    rgba(227, 231, 255, 0.9) 11.88%,
    rgba(216, 221, 255, 0) 102.18%
  );
  box-shadow: 0px 0px 20px rgba(168, 193, 221, 0.25);
  position: fixed;
  z-index: 3;
  bottom: 180px;
  width: 50px;
  height: 50px;
`

export const Contact: React.FC = () => {
  const bodyRef = useRef(document.body)
  const bodyWidth = useWidth(bodyRef)

  const right = useMemo(() => {
    if (bodyWidth == null) {
      return 0
    }
    if (bodyWidth <= CONTAINER_MAX_WIDTH) {
      return 0
    }
    return `${(bodyWidth - CONTAINER_MAX_WIDTH) / 2}px`
  }, [bodyWidth])

  const confirmDialog = useConfirmDialog()
  const [t] = useTranslation('translations')
  const toast = useToast()

  return (
    <Container
      borderLeftRadius="22px"
      right={right}
      cursor="pointer"
      onClick={() => {
        confirmDialog({
          type: 'success',
          title: (
            <Text>
              {t('orders.dialog.contact')}
              <Link isExternal href={`mailto:${CONTACT_ADDRESS}`}>
                {CONTACT_ADDRESS}
              </Link>
            </Text>
          ),
          okText: t('orders.dialog.copy-email-address'),
          onConfirm() {
            clipboard.writeText(CONTACT_ADDRESS)
            toast(t('info.copied'))
          },
        })
      }}
    >
      <ContactIcon />
    </Container>
  )
}
