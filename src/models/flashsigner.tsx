export enum FlashsignerAction {
  Sign = 'sign',
  Login = 'login',
  SignTx = 'sign-tx',
  Redeem = 'redeem',
}

export interface FlashsignerData {
  lock: RPC.Script
}

export interface FlashsignerLoginData extends FlashsignerData {
  sig: string
}

export interface FlashsignerSignData extends FlashsignerData {
  tx: RPC.Transaction
}

export interface FlashsignerResponse {
  code: number
  info: string
  result: FlashsignerLoginData | FlashsignerSignData
}

export interface FlashsignerTransferNftState {
  ckbAddress: string
  uuid: string
}
