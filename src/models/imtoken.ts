import { Transaction, transformers } from '@lay2/pw-core'
import { Wallet } from './wallet'

declare const TokenWebView: any
// const IMTOKEN_TEST_ADDRESS =
//   process.env.REACT_APP_IMTOKEN_TEST_ADDRESS ??
//   'ckt1qyq97t3shkua45qqakk0kyv4kveks6868hvsv5c2yh'

export class ImtokenWallet implements Wallet {
  static async getAddress(): Promise<string> {
    try {
      const [
        address,
      ] = await TokenWebView.apis.internal.dangerouslyPromisifyAPI(
        'nervos.getAccounts'
      )
      return address
    } catch (error) {
      // todo: handle user reject
      return ''
    }
  }

  static async signTransaction(tx: Transaction): Promise<RPC.RawTransaction> {
    try {
      const rawTx = transformers.TransformTransaction(tx)
      console.log('rawTx:\n', rawTx)
      const signedTx = await TokenWebView.apis.internal.dangerouslyPromisifyAPI(
        'nervos.signTransaction',
        rawTx
      )
      console.log('signedTx:\n', signedTx)
      return signedTx
    } catch (error) {
      console.log('sign error:\n', error)
      // todo: handle user reject
      return Object.create(null)
    }
  }
}
