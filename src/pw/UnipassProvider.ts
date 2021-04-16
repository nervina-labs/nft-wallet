import {
  Address,
  AddressType,
  Platform,
  Provider,
  Script,
  HashType,
  AddressPrefix,
} from '@lay2/pw-core'
import { createHash } from 'crypto'
// import { unipassCache } from '../cache'
import { UNIPASS_URL } from '../constants'

type UP_ACT = 'UP-READY' | 'UP-LOGIN' | 'UP-SIGN' | 'UP-CLOSE'

function pubkeyToAddress(pubkey: string): string {
  const pubKeyBuffer = Buffer.from(pubkey.replace('0x', ''), 'hex')
  const hashHex =
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    '0x' +
    createHash('SHA256')
      .update(pubKeyBuffer)
      .digest('hex')
      .toString()
      .slice(0, 40)
  // console.log('hashHex', hashHex);

  const script = new Script(
    '0x6843c5fe3acb7f4dc2230392813cb9c12dbced5597fca30a52f13aa519de8d33',
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
    // const cachedEmail = unipassCache.getUnipassEmail()
    // const cachedAddress = unipassCache.getUnipassAddress()

    // if (cachedAddress != null && cachedEmail != null) {
    //   this._email = cachedEmail
    //   this.address = new Address(cachedAddress, AddressType.ckb)
    //   return this
    // }

    return await new Promise((resolve, reject) => {
      this.msgHandler = (event) => {
        if (typeof event.data === 'object' && 'upact' in event.data) {
          const msg = event.data as UnipassMessage
          if (msg.upact === 'UP-READY') {
            const msg: UnipassMessage = { upact: 'UP-LOGIN' }
            event.source != null &&
              (event.source as Window).postMessage(msg, event.origin)
          } else if (msg.upact === 'UP-LOGIN') {
            const { payload } = msg
            if (payload === undefined || typeof payload === 'string') {
              return
            }
            const { pubkey, email } = payload
            const ckbAddress = pubkeyToAddress(pubkey)
            this.address = new Address(ckbAddress, AddressType.ckb)
            this._email = email
            this.msgHandler != null &&
              window.removeEventListener('message', this.msgHandler)
            ;(event.source as Window).close()
            resolve(this)
          }
        }
      }

      window.addEventListener('message', this.msgHandler, false)
      this.openWindow('login')
    })
  }

  async sign(message: string): Promise<string> {
    console.log('[UnipassProvider] message to sign', message)
    return await new Promise((resolve) => {
      this.msgHandler = (event) => {
        if (typeof event.data === 'object' && 'upact' in event.data) {
          const msg = event.data as UnipassMessage
          if (msg.upact === 'UP-READY') {
            event.source != null &&
              (event.source as Window).postMessage(
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                {
                  upact: 'UP-SIGN',
                  payload: message ?? 'N/A',
                } as UnipassMessage,
                event.origin
              )
          } else if (msg.upact === 'UP-SIGN') {
            const signature = msg.payload
            if (typeof signature !== 'string') {
              return
            }
            console.log('[Sign] signature: ', signature)
            this.msgHandler != null &&
              window.removeEventListener('message', this.msgHandler)
            ;(event.source as Window).close()
            resolve('0x' + signature)
          }
        }
      }

      window.addEventListener('message', this.msgHandler, false)
      this.openWindow('sign')
    })
  }

  close(): void {
    this.msgHandler != null &&
      window.removeEventListener('message', this.msgHandler)
  }

  openWindow(title: string): false {
    window.open(
      `${this.UNIPASS_BASE}/#/${title}`,
      title,
      `toolbar=no,
      location=no,
      status=no,
      menubar=no,
      scrollbars=yes,
      resizable=yes,
      top=30,
      left=20,
      width=360,
      height=640`
    )
    return false
  }
}
