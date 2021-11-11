import {
  Address,
  AddressType,
  Provider,
  verifyEthAddress,
  Web3ModalProvider as OriginPWWeb3ModalProvider,
} from '@lay2/pw-core'
import { IS_MAINNET, IS_TOKEN_POCKET } from '../constants'

const noop: OnAddressChangedCallback = () => {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type OnAddressChangedCallback = (newAddress: Address | undefined) => void

export class Web3Provider extends OriginPWWeb3ModalProvider {
  onAddressChanged: OnAddressChangedCallback

  constructor(readonly web3: any, onAddressChanged?: OnAddressChangedCallback) {
    super(web3)
    this.onAddressChanged = onAddressChanged ?? noop
  }

  async init(): Promise<Provider> {
    const accounts = await this.web3.eth.getAccounts()
    if (!verifyEthAddress(accounts[0])) {
      throw new Error('get ethereum address failed')
    }

    this.address = new Address(accounts[0], AddressType.eth)
    if (this.web3.currentProvider?.on) {
      this.web3.currentProvider.on(
        'accountsChanged',
        async (newAccounts: string[]) => {
          if (!newAccounts || newAccounts.length === 0) {
            if (this.onAddressChanged) this.onAddressChanged(undefined)
            return
          }
          this.address = new Address(newAccounts[0], AddressType.eth)
          if (this.onAddressChanged) {
            this.onAddressChanged(this.address)
          }
        }
      )
      this.web3.currentProvider.on('disconnect', () => {
        this.onAddressChanged(undefined)
      })
    }

    return this
  }

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  signMsg(message: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const from = this.address.addressString

      if (typeof window.ethereum !== 'undefined' && !IS_TOKEN_POCKET) {
        ;(window.ethereum as any)
          .request({ method: 'personal_sign', params: [from, message] })
          .then((result: string) => {
            resolve(result)
          })
          .catch((err: any) => {
            reject(err)
          })
      } else if (window.web3) {
        window.web3.currentProvider.sendAsync(
          { method: 'personal_sign', params: [message, from], from },
          (err: any, result: any) => {
            if (err) {
              reject(err)
            }
            if (result?.error) {
              reject(result.error)
            }
            resolve(result?.result)
          }
        )
      } else {
        reject(
          new Error(
            'window.ethereum/window.web3 is undefined, Ethereum environment is required.'
          )
        )
      }
    })
  }

  async sign(message: string): Promise<string> {
    if (!IS_MAINNET) {
      return await super.sign(message)
    }
    return await new Promise((resolve, reject) => {
      const from = this.address.addressString

      const handleResult = (result: string): string => {
        let v = Number.parseInt(result.slice(-2), 16)
        if (v >= 27) v -= 27
        result = result.slice(0, -2) + v.toString(16).padStart(2, '0')
        return result
      }

      if (window.web3) {
        window.web3.currentProvider.sendAsync(
          { method: 'personal_sign', params: [message, from], from },
          (err: any, result: any) => {
            if (err) {
              reject(err)
            }
            if (result.error) {
              reject(result.error)
            }
            resolve(handleResult(result.result))
          }
        )
      } else if (typeof window.ethereum !== 'undefined') {
        ;(window.ethereum as any)
          .request({ method: 'personal_sign', params: [from, message] })
          .then((result: string) => {
            resolve(handleResult(result))
          })
          .catch((err: any) => {
            reject(err)
          })
      } else {
        reject(
          new Error(
            'window.ethereum/window.web3 is undefined, Ethereum environment is required.'
          )
        )
      }
    })
  }
}
