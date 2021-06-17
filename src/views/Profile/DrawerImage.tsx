import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useWalletModel } from '../../hooks/useWallet'
import { RoutePath } from '../../routes'
import { DrawerAcion } from './DrawerAction'

export interface DrawerImageProps {
  showAvatarAction: boolean
  setShowAvatarAction: React.Dispatch<React.SetStateAction<boolean>>
}

const allowedTypes =
  'image/png, image/jpeg, image/jpg, image/gif, image/svg+xml, image/webp'

export const DrawerImage: React.FC<DrawerImageProps> = ({
  showAvatarAction,
  setShowAvatarAction,
}) => {
  const [t] = useTranslation('translations')
  const { toast } = useWalletModel()
  const history = useHistory()
  return (
    <DrawerAcion
      isDrawerOpen={showAvatarAction}
      close={() => setShowAvatarAction(false)}
      actions={[
        { content: t('profile.avatar.camera'), value: 'camera' },
        {
          content: (
            <label htmlFor="upload" className="label">
              {t('profile.avatar.photo-lib')}
              <input
                type="file"
                id="upload"
                accept={allowedTypes}
                onChange={(e) => {
                  const [file] = e.target.files ?? []
                  const [, ext] = file == null ? [] : file?.type?.split('/')
                  if (file) {
                    if (file.size >= 5242880) {
                      toast(t('profile.size-limit'))
                      return
                    } else if (!allowedTypes.split(', ').includes(file.type)) {
                      toast(t('profile.wrong-image-format'))
                      return
                    }
                    history.push(RoutePath.ImagePreview, {
                      datauri: URL.createObjectURL(file),
                      ext,
                    })
                  }
                }}
                style={{ display: 'none' }}
              />
            </label>
          ),
          value: 'lib',
        },
      ]}
      actionOnClick={(val) => {
        if (val === 'camera') {
          history.push(RoutePath.TakePhoto)
        }
      }}
    />
  )
}
