import { payTransactions } from '@/lib/crypto'

export async function process(params: any) {
  const toPayTransactions = params.transactions
  // console.log('toPayTransactions', toPayTransactions)
  console.log("调用Pay 方法：");
  
  const payedTransactions = await payTransactions(toPayTransactions, params.hasMetaid)
  // console.log("payedTransactions", payedTransactions);
  

  return { payedTransactions }
}
