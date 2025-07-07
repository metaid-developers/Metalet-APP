import { payTransactions } from '@/lib/crypto'

export async function process(params: any) {
  const toPayTransactions = params.transactions
  // console.log('toPayTransactions', toPayTransactions)
  
  // const payedTransactions = await payTransactions(toPayTransactions, params.hasMetaid)
    const payedTransactions = await payTransactions(toPayTransactions, params.hasMetaid,params.feeb)

  // console.log("payedTransactions", payedTransactions);
  

  return { payedTransactions }
}
