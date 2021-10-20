import { Transaction, transformers } from '@lay2/pw-core'
import { Wallet } from './wallet'
import TokenWebView from '@consenlabs-fe/webview'

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
      return signedTx as any
    } catch (error) {
      console.log('sign error:\n', error)
      // todo: handle user reject
      return Object.create(null)
    }
  }
}
