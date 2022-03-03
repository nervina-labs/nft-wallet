import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'
import { IS_IPHONE, IS_MOBILE, IS_STANDALONE, IS_WEXIN } from '../constants'
import { useDidMount } from './useDidMount'

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 */
interface BeforeInstallPromptEvent extends Event {
  /**
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: string[]

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt: () => Promise<void>
}

export const pwaPromptAtom = atom<BeforeInstallPromptEvent | null>(null)
export const isPwaInstalledAtom = atom(false)

export const usePwaGuide = () => {
  const [pwaPrompt, setPwaPrompt] = useAtom(pwaPromptAtom)
  const [isPwaInstalled, setIsPwaInstalled] = useAtom(isPwaInstalledAtom)
  useDidMount(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setPwaPrompt(e as BeforeInstallPromptEvent)
    })

    window.addEventListener('appinstalled', () => {
      setIsPwaInstalled(true)
    })
  })

  const installPwa = async () => {
    if (pwaPrompt) {
      pwaPrompt.prompt()
      const { outcome } = await pwaPrompt.userChoice
      if (outcome === 'accepted') {
        pwaPrompt.prompt()
      }
    }
  }

  const isPwaInstallable = useMemo(() => {
    return (
      (!!pwaPrompt || IS_IPHONE) && IS_MOBILE && !IS_WEXIN && !IS_STANDALONE
    )
  }, [pwaPrompt])

  return {
    installPwa,
    isPwaInstalled,
    pwaPrompt,
    isPwaInstallable,
  }
}
