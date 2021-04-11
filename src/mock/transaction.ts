export const nftTransaction = Object.create({
  hash: null,
  version: 0,
  cell_deps: [
    {
      out_point: {
        tx_hash:
          '0x9687ac5e311d009df1505459afc83a55c46496eb292fc11e4f6c24df5dfd4de5',
        index: '0x0',
      },
      dep_type: 'code',
    },
    {
      out_point: {
        tx_hash:
          '0xa105c3277ea36914e2af26e749adb307276f89f614dc945f9f44988b4be9c1d6',
        index: '0x0',
      },
      dep_type: 'code',
    },
  ],
  header_deps: [],
  inputs: [
    {
      previous_output: {
        index: '0x0',
        tx_hash:
          '0xe9590e0247a6a0c0b18ba834380a6ce61807e96027c380aba96813e977ff94d6',
      },
      since: 0,
    },
  ],
  outputs: [
    {
      capacity: 99900000000,
      lock: {
        code_hash:
          '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        args: '0x256d81c8fe0dd5dfebb0a806ccbfa81d1a3f8292',
        hash_type: 'type',
      },
      type: {
        code_hash:
          '0xb1837b5ad01a88558731953062d1f5cb547adf89ece01e8934a9f0aeed2d959f',
        args: '0x0100000007000000',
        hash_type: 'type',
      },
    },
  ],
  outputs_data: [
    '0x00000000000000000000000000000000001000007b226e616d65223a22616c696365227d',
  ],
  witnesses: [
    {
      lock: '',
      input_type: '',
      output_type: '',
    },
  ],
})
