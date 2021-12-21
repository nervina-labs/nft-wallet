import { forwardRef } from 'react'
import { IS_IPHONE, IS_SUPPORT_AR } from '../../../constants'
import ArSvgPath from '../../../assets/svg/ar.svg'
import { useConfirmDialog } from '../../../hooks/useConfirmDialog'
import { Box } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export const ArButton = forwardRef<HTMLAnchorElement, { href?: string }>(
  ({ href, ...props }, ref) => {
    const { t } = useTranslation('translations')
    const confirmDialog = useConfirmDialog()
    const dialogTitle = IS_IPHONE
      ? t('nft.no-support-ar')
      : t('nft.only-support-ios')
    const dialogDescription = IS_IPHONE ? (
      <Box as="span" whiteSpace="pre-line">
        {t('nft.copy-to-browser')}
      </Box>
    ) : null

    return (
      <a
        rel="ar"
        href={href}
        role="button"
        ref={ref}
        style={{ display: 'flex' }}
        onClick={(e) => {
          if (!IS_SUPPORT_AR) {
            e.stopPropagation()
            e.preventDefault()

            confirmDialog({
              type: 'warning',
              title: (
                <Box fontSize="16px" fontWeight="500" whiteSpace="pre-line">
                  {dialogTitle}
                </Box>
              ),
              description: dialogDescription,
              okText: t('nft.no-support-usdz-ok'),
              okButtonProps: {
                variant: 'outline',
                colorScheme: 'gray',
              },
            })
          }
        }}
        {...props}
      >
        <img src={ArSvgPath} alt="ar" style={{ margin: 'auto 4px' }} />
        AR
      </a>
    )
  }
)
