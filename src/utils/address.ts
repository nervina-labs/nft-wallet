import { parseAddress } from '@nervosnetwork/ckb-sdk-utils'
import { INFURA_ID, IS_MAINNET } from '../constants'
import Web3 from 'web3'

export const verifyCkbAddress = (address: string): boolean => {
  try {
    parseAddress(address)
  } catch (err) {
    return false
  }
  return (
    address.startsWith(IS_MAINNET ? 'ckb' : 'ckt') &&
    /^[A-Za-z0-9]+$/.test(address)
  )
}

export const verifyEthAddress = (addr: string): boolean => {
  return Web3.utils.isAddress(addr)
}

export const verifyEthContractAddress = async (
  addr: string
): Promise<boolean> => {
  try {
    const Web3 = (await import('web3')).default
    const provider = new Web3.providers.HttpProvider(
      `https://mainnet.infura.io/v3/${INFURA_ID}`
    )
    const web3 = new Web3(provider)
    const code = await web3.eth.getCode(addr)
    provider.disconnect()
    return code !== '0x'
  } catch (error) {
    console.log(error)
    return false
  }
}

const DASReg: RegExp = /^((\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|[0-9a-zA-Z])+\.bit$/
export const verifyDasAddress = (addr: string): boolean => {
  return DASReg.test(addr)
}
