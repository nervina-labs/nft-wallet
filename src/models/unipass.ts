export enum UnipassAction {
  Sign = 'sign',
  Login = 'login',
  SignTx = 'sign-tx',
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
