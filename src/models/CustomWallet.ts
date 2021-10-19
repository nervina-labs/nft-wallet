import { ImtokenWallet } from './imtoken'
import { Wallet } from './wallet'

export class CustomWallet {
  static getInstance(): typeof Wallet {
    // todo: conditional wallet according process.env
    return ImtokenWallet
  }
}

export const customWallet = CustomWallet.getInstance()
