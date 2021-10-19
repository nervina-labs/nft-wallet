/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Transaction } from '@lay2/pw-core'

export abstract class Wallet {
  static getAddress: () => Promise<string>
  static signTransaction: (tx: Transaction) => Promise<RPC.RawTransaction>
}
