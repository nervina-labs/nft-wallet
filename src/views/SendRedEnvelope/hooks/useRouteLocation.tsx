import { useLocation } from 'react-router-dom'

export interface FormInfoState {
  rewardAmount: string
  greeting: string
  puzzleQuestion?: string
  puzzleAnswer?: string
  tokenUuids: string[]
}

export interface SendRedEnvelopeRouteState {
  prevState?: Omit<FormInfoState, 'tokenUuids'> & {
    tokenUuids: string | string[]
  }
  signature?: string
  tx?: RPC.RawTransaction
}

export function useRouteLocation() {
  return useLocation<SendRedEnvelopeRouteState>()
}
