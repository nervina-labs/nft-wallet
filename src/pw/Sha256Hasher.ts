import { Hasher, Reader } from '@lay2/pw-core'
import { createHash } from 'crypto'

export default class Sha256Hasher extends Hasher {
  constructor() {
    super(createHash('SHA256'))
  }

  update(data: string | ArrayBuffer | Reader): Hasher {
    let array: Buffer
    if (data instanceof Reader) {
      /** Reader type params not enter this branch, it's weired */
      array = Buffer.from(data.serializeJson().replace('0x', ''))
    } else if (data instanceof ArrayBuffer) {
      array = Buffer.from(new Uint8Array(data))
    } else if (typeof data === 'string') {
      array = Buffer.from(data)
    } else {
      array = Buffer.from(new Uint8Array(new Reader(data).toArrayBuffer()))
    }
    this.h.update(array)
    return this
  }

  digest(): Reader {
    const hex = '0x' + this.h.digest('hex').toString()
    return new Reader(hex)
  }

  reset(): void {
    this.h = createHash('SHA256')
  }
}
