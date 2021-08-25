export enum ClaimStatus {
  Pending = 'pending',
  Unclaimed = 'unclaimed',
  Claimed = 'claimed',
}

export interface ClaimResult {
  state: ClaimStatus
  code: string
  claimed_at: string
}
