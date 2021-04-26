/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  // Builder,
  Cell,
  CellDep,
  OutPoint,
  RawTransaction,
  Script,
  Transaction,
  Amount,
  AmountUnit,
  // DepType,
} from '@lay2/pw-core'
import { RPC as ToolKitRpc } from 'ckb-js-toolkit'
import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { NODE_URL } from '../constants'

export const toolkitRPC = new ToolKitRpc(NODE_URL)

// const Secp256R1BinOutPoint = new OutPoint(
//   '0x9687ac5e311d009df1505459afc83a55c46496eb292fc11e4f6c24df5dfd4de5',
//   '0x0'
// )
const UnipassWitnessArgs = {
  lock: '0x' + '0'.repeat(2082),
  input_type: '',
  output_type: '',
}

export async function rawTransactionToPWTransaction(
  rawTx: RPC.RawTransaction
): Promise<Transaction> {
  const inputs = await Promise.all(
    rawTx.inputs.map(
      async (i) =>
        await Cell.loadFromBlockchain(
          toolkitRPC,
          new OutPoint(i.previous_output?.tx_hash!, i.previous_output?.index!)
        )
    )
  )

  const outputs = rawTx.outputs.map(
    (o, index) =>
      new Cell(
        new Amount(o.capacity, AmountUnit.shannon),
        new Script(o.lock.code_hash, o.lock.args, o.lock.hash_type as any),
        o.type != null
          ? new Script(o.type.code_hash, o.type.args, o.type.hash_type as any)
          : undefined,
        undefined,
        rawTx.outputs_data[index]
      )
  )

  const cellDeps = rawTx.cell_deps.map(
    (c) =>
      new CellDep(
        c.dep_type as any,
        new OutPoint(c.out_point?.tx_hash!, c.out_point?.index!)
      )
  )

  const tx = new Transaction(
    new RawTransaction(
      inputs,
      outputs,
      cellDeps
      // rawTx.header_deps,
      // rawTx.version
    ),
    [UnipassWitnessArgs]
  )

  return tx
}
