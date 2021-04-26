import {
  Address,
  AddressType,
  Platform,
  Provider,
  Script,
  HashType,
  AddressPrefix,
  Blake2bHasher,
} from '@lay2/pw-core'
import { unipassCache } from '../cache'
// import { unipassCache } from '../cache'
import { UNIPASS_URL } from '../constants'

type UP_ACT = 'UP-READY' | 'UP-LOGIN' | 'UP-SIGN' | 'UP-CLOSE'
interface IFrame {
  blackOut: HTMLDivElement
  uniFrame: HTMLIFrameElement
}

function openIframe(
  title: string,
  url: string,
  onload: (this: GlobalEventHandlers, ev: Event) => unknown
): IFrame {
  const uniFrame = document.createElement('iframe')
  const blackOut = document.createElement('div')
  uniFrame.src = url
  uniFrame.style.width = '80%'
  uniFrame.style.height = '80%'
  uniFrame.style.backgroundColor = '#FFF'
  uniFrame.setAttribute('scrolling', 'no')
  uniFrame.setAttribute('frameborder', 'no')
  // uniFrame.style.display = 'none'
  uniFrame.onload = function (this: GlobalEventHandlers, ev: Event) {
    blackOut.style.visibility = 'visible'
    return onload.call(this, ev)
  }

  blackOut.id = 'uni-frame'
  blackOut.style.visibility = 'hidden'
  blackOut.style.position = 'absolute'
  blackOut.style.zIndex = '9999'
  blackOut.style.left = '0'
  blackOut.style.top = '0'
  blackOut.style.width = '100%'
  blackOut.style.height = '100%'
  blackOut.style.backgroundColor = 'rgba(0,0,0,.65)'
  blackOut.style.display = 'flex'
  blackOut.style.justifyContent = 'center'
  blackOut.style.alignItems = 'center'

  blackOut.appendChild(uniFrame)
  document.body.appendChild(blackOut)

  return { blackOut, uniFrame }
}

function pubkeyToAddress(pubkey: string): string {
  const pubKeyBuffer = Buffer.from(pubkey.replace('0x', ''), 'hex')
  const hashHex = new Blake2bHasher()
    .update(pubKeyBuffer.buffer)
    .digest()
    .serializeJson()
    .slice(0, 42)

  const script = new Script(
    '0x124a60cd799e1fbca664196de46b3f7f0ecb7138133dcaea4893c51df5b02be6',
    hashHex,
    HashType.type
  )

  return script.toAddress(AddressPrefix.ckt).toCKBAddress()
}

export interface UnipassAccount {
  pubkey: string
  email: string
}
export interface UnipassMessage {
  upact: UP_ACT
  payload?: string | UnipassAccount
}

export default class UnipassProvider extends Provider {
  private _email: string | undefined
  // eslint-disable-next-line prettier/prettier
  private msgHandler:
  // eslint-disable-next-line prettier/prettier
  | ((this: Window, event: MessageEvent) => unknown)
  | undefined

  get email(): string | undefined {
    return this._email
  }

  constructor(private readonly UNIPASS_BASE = UNIPASS_URL) {
    super(Platform.ckb)
  }

  async init(): Promise<UnipassProvider> {
    return await new Promise((resolve) => {
      const { blackOut, uniFrame } = openIframe(
        'login',
        `${this.UNIPASS_BASE}/#/login`,
        () => {
          const msg: UnipassMessage = {
            upact: 'UP-LOGIN',
          }
          uniFrame.contentWindow?.postMessage(msg, this.UNIPASS_BASE)
        }
      )

      this.msgHandler = (event) => {
        if (typeof event.data === 'object' && 'upact' in event.data) {
          const msg = event.data as UnipassMessage
          if (msg.upact === 'UP-LOGIN') {
            const { pubkey, email } = msg.payload as UnipassAccount
            const ckbAddress = pubkeyToAddress(pubkey)
            this.address = new Address(ckbAddress, AddressType.ckb)
            unipassCache.setUnipassLoginDate(`${Date.now()}`)
            unipassCache.setUnipassEmail(email)
            unipassCache.setUnipassAddress(ckbAddress)
            this._email = email
            this.msgHandler != null &&
              window.removeEventListener('message', this.msgHandler)
            blackOut?.remove()
            resolve(this)
          }
        }
      }

      window.addEventListener('message', this.msgHandler, false)
    })
  }

  async sign(message: string): Promise<string> {
    console.log('[UnipassProvider] message to sign', message)
    return await new Promise((resolve) => {
      const { blackOut, uniFrame } = openIframe(
        'sign',
        `${this.UNIPASS_BASE}/#/sign`,
        () => {
          const msg: UnipassMessage = {
            upact: 'UP-SIGN',
            payload: message,
          }
          uniFrame.contentWindow?.postMessage(msg, this.UNIPASS_BASE)
        }
      )
      this.msgHandler = (event) => {
        if (typeof event.data === 'object' && 'upact' in event.data) {
          const msg = event.data as UnipassMessage
          if (msg.upact === 'UP-SIGN') {
            const signature = msg.payload as string
            console.log('[Sign] signature: ', signature)
            this.msgHandler != null &&
              window.removeEventListener('message', this.msgHandler)
            blackOut?.remove()
            resolve(`0x01${signature.replace('0x', '')}`)
          }
        }
      }

      window.addEventListener('message', this.msgHandler, false)
    })
  }

  close(): void {
    this.msgHandler != null &&
      window.removeEventListener('message', this.msgHandler)
  }
}
