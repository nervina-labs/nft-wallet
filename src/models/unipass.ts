export enum UnipassAction {
  Sign = 'sign',
  Login = 'login',
  SignTx = 'sign-tx',
  Redeem = 'redeem',
  RedEnvelope = 'red-envelope',
}

export interface UnipassData {
  pubkey: string
}

export interface UnipassLoginData extends UnipassData {
  email: string
}

export interface UnipassSignData extends UnipassData {
  pubkey: string
  sig: string
}

export interface UnipassResponse {
  code: number
  info: string
  data: UnipassLoginData | UnipassSignData
}

export interface UnipassTransferNftState {
  ckbAddress: string
  uuid: string
}
