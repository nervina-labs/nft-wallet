import { UPAuthResponse } from 'up-core-test'
import axios from 'axios'
import { createHash } from 'crypto'
import NodeRSA from 'node-rsa'

interface RSAPubkey {
  e: number
  n: string
}

interface Pubkey {
  secp256k1?: string
  rsa_pubkey?: RSAPubkey
}

interface UserInfo {
  username: string
  local_keys: Pubkey[]
}

async function fetchUserInfoOnChain(username: string) {
  const usernameHash = `0x${createHash('sha256')
    .update(username)
    .digest('hex')}`

  const req = {
    id: 2,
    jsonrpc: '2.0',
    method: 'get_user_info',
    params: [usernameHash],
  }

  const resp = await axios.post('https://t.aggregator.unipass.id/dev/', req)
  if (resp.status !== 200) {
    throw new Error(`aggregator request failed with HTTP code ${resp.status}`)
  }
  if (resp.data.error !== undefined) {
    throw new Error(
      `aggregator request rpc failed with error: ${JSON.stringify(
        resp.data.error
      )}`
    )
  }
  return resp.data.result[0] as UserInfo
}

async function checkPubkeyOnChain(
  username: string,
  keyType: string,
  pubkey: string
): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { local_keys } = await fetchUserInfoOnChain(username)

  console.log('local_keys', local_keys)

  const mapLocalPubkey = (x: Pubkey) => {
    let keyType = ''
    let keyValue = ''
    if (x.rsa_pubkey) {
      keyType = 'RsaPubkey'
      const { e, n } = x.rsa_pubkey
      const nA = Buffer.from(n.replace('0x', ''), 'hex')
      const eA = Buffer.alloc(4)
      eA.writeUInt32BE(e, 0)
      keyValue = '0x' + Buffer.concat([eA, nA]).toString('hex')
    } else if (x.secp256k1) {
      keyType = 'Secp256k1Pubkey'
      keyValue = x.secp256k1
    }
    return { keyType, keyValue }
  }

  const keyExist = local_keys
    .map(mapLocalPubkey)
    .find((x) => x.keyType === keyType && x.keyValue === pubkey)

  return !!keyExist
}

function getPubkeyFromUPKey(upPubkey: string) {
  const key = new NodeRSA()

  const pubkeyBuffer = Buffer.from(upPubkey.replace('0x', ''), 'hex')
  const e = pubkeyBuffer.slice(0, 4).readUInt32BE(0)
  const n = pubkeyBuffer.slice(4)

  key.importKey(
    {
      e,
      n,
    },
    'components-public'
  )
  key.setOptions({ signingScheme: 'pkcs1-sha256' })

  return key
}

export async function verifyUniPassSig(
  username: string,
  msg: string,
  authResp: UPAuthResponse
): Promise<boolean> {
  const { keyType, pubkey, sig } = authResp

  const isPubkeyOnChain = await checkPubkeyOnChain(username, keyType, pubkey)
  if (!isPubkeyOnChain) {
    throw new Error('pubkey not valid on chain')
  }

  if (keyType === 'RsaPubkey') {
    const key = getPubkeyFromUPKey(pubkey)

    // prefix message for plain msg
    let messageBuffer = Buffer.from(msg)
    const prefix = Buffer.from(
      `\u0018UniPass Signed Message:\n${messageBuffer.length.toString()}`,
      'utf-8'
    )
    messageBuffer = Buffer.concat([prefix, messageBuffer])

    const ret = key.verify(
      messageBuffer,
      Buffer.from(sig.replace('0x', ''), 'hex')
    )

    console.log('verify: ', ret)

    return ret
  } else {
    throw new Error(`UnSupported keyType ${keyType}`)
  }
}
