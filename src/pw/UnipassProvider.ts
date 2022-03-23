import PWCore, {
  Address,
  AddressType,
  Platform,
  Provider,
  Script,
  HashType,
  AddressPrefix,
  Blake2bHasher,
  ChainID,
  CHAIN_SPECS,
} from '@lay2/pw-core'
// import { unipassCache } from '../cache'
import { IS_MAINNET, PW_CODE_HASH } from '../constants'
import { UnipassAccount as Account, WalletType } from '../hooks/useAccount'

type UP_ACT = 'UP-READY' | 'UP-LOGIN' | 'UP-SIGN' | 'UP-CLOSE'

PWCore.chainId = IS_MAINNET ? ChainID.ckb : ChainID.ckb_testnet
PWCore.config = IS_MAINNET ? CHAIN_SPECS.Lina : CHAIN_SPECS.Aggron

interface IFrame {
  uniFrame: HTMLIFrameElement
}

let uniFrame: HTMLIFrameElement

function openIframe(
  title: string,
  url: string,
  onload?: (this: GlobalEventHandlers, ev: Event) => unknown,
  reject?: (r: any) => void
): IFrame {
  if (uniFrame !== undefined) closeFrame(uniFrame)
  document.body.style.margin = '0'
  document.body.style.height = '100%'
  document.body.style.overflow = 'hidden'

  const container = document.createElement('div')
  container.style.visibility = 'hidden'
  uniFrame = document.createElement('iframe')
  uniFrame.src = url
  uniFrame.style.visibility = 'hidden'
  uniFrame.style.width = '100%'
  uniFrame.style.height = '100vh'
  uniFrame.style.zIndex = '2147483649'
  uniFrame.style.position = 'absolute'
  uniFrame.style.backgroundColor = 'rgba(0,0,0,.65)'
  const { left, top } = document.documentElement.getBoundingClientRect()
  uniFrame.style.left = `${left}px`
  uniFrame.style.top = `${-top}px`
  uniFrame.setAttribute('scrolling', 'no')
  uniFrame.setAttribute('frameborder', 'no')
  uniFrame.onload = function (this: GlobalEventHandlers, ev: Event) {
    uniFrame.style.visibility = 'visible'
    return onload?.call(this, ev)
  }

  document.body.appendChild(uniFrame)

  return { uniFrame }
}

export function pubkeyToAddress(pubkey: string): string {
  const pubKeyBuffer = Buffer.from(pubkey.replace('0x', ''), 'hex')
  const hashHex = new Blake2bHasher()
    .update(pubKeyBuffer.buffer)
    .digest()
    .serializeJson()
    .slice(0, 42)

  const script = new Script(PW_CODE_HASH, hashHex, HashType.type)
  return script
    .toAddress(IS_MAINNET ? AddressPrefix.Mainnet : AddressPrefix.Testnet)
    .toCKBAddress()
}

function closeFrame(frame: HTMLIFrameElement): void {
  console.log('[UnipassProvider] close frame')
  frame.remove()
  document.body.style.removeProperty('overflow')
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

  private readonly setStorage: (account: Account) => void

  get email(): string | undefined {
    return this._email
  }

  constructor(
    private readonly UNIPASS_BASE: string,
    setStorage: (newValue: Account | null) => void
  ) {
    super(Platform.ckb)
    this.setStorage = setStorage
  }

  async connect(account: Account | null): Promise<UnipassProvider> {
    if (account !== null) {
      const { address, email } = account
      this.address = new Address(address, AddressType.ckb)
      this._email = email
      return await Promise.resolve(this)
    }

    return await this.init()
  }

  async init(): Promise<UnipassProvider> {
    return await new Promise((resolve, reject) => {
      const { uniFrame } = openIframe(
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
          console.log(msg)
          if (msg.upact === 'UP-LOGIN') {
            const { pubkey, email } = msg.payload as UnipassAccount
            const ckbAddress = pubkeyToAddress(pubkey)
            this.address = new Address(ckbAddress, AddressType.ckb)
            console.log('address', this.address)
            this.setStorage({
              address: ckbAddress,
              email: email,
              walletType: WalletType.Unipass,
            })
            this._email = email
            this.msgHandler != null &&
              window.removeEventListener('message', this.msgHandler)
            uniFrame !== undefined && closeFrame(uniFrame)
            resolve(this)
          } else if (msg.upact === 'UP-CLOSE') {
            uniFrame !== undefined && closeFrame(uniFrame)
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
      const { uniFrame } = openIframe('sign', `${this.UNIPASS_BASE}/#/sign`)
      this.msgHandler = (event) => {
        if (typeof event.data === 'object' && 'upact' in event.data) {
          const msg = event.data as UnipassMessage
          console.log('log', msg)
          if (msg.upact === 'UP-SIGN') {
            const signature = msg.payload as string
            console.log('[Sign] signature: ', signature)
            this.msgHandler != null &&
              window.removeEventListener('message', this.msgHandler)
            uniFrame !== undefined && closeFrame(uniFrame)
            resolve(`0x01${signature.replace('0x', '')}`)
          } else if (msg.upact === 'UP-READY') {
            console.log('[UnipassProvider] sign READY')
            const msg: UnipassMessage = {
              upact: 'UP-SIGN',
              payload: message,
            }
            uniFrame.contentWindow?.postMessage(msg, this.UNIPASS_BASE)
            console.log('[UnipassProvider] opend')
          } else if (msg.upact === 'UP-LOGIN') {
            const { pubkey, email } = msg.payload as UnipassAccount
            const ckbAddress = pubkeyToAddress(pubkey)
            this.address = new Address(ckbAddress, AddressType.ckb)
            this.setStorage({
              address: ckbAddress,
              email: email,
              walletType: WalletType.Unipass,
            })
            this._email = email
            this.msgHandler != null &&
              window.removeEventListener('message', this.msgHandler)
            uniFrame !== undefined && closeFrame(uniFrame)
            // window.location.reload();
            resolve('0x')
          } else if (msg.upact === 'UP-CLOSE') {
            uniFrame !== undefined && closeFrame(uniFrame)
            resolve('N/A')
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

  terminate(): void {
    this.close()
    uniFrame !== undefined && closeFrame(uniFrame)
  }
}
