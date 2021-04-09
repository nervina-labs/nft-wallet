import { Signer, Message, Provider } from '@lay2/pw-core'
import Sha256Hasher from './Sha256Hasher'

export default class UnipassSigner extends Signer {
  constructor(public readonly provider: Provider) {
    super(new Sha256Hasher())
  }

  async signMessages(messages: Message[]): Promise<string[]> {
    const sigs = []
    for (const message of messages) {
      if (
        this.provider.address.toLockScript().toHash() === message.lock.toHash()
      ) {
        sigs.push(await this.provider.sign(message.message))
      } else {
        sigs.push('0x')
      }
    }

    return sigs
  }
}
