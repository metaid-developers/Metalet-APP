import { getCurrentWallet } from '@/lib/wallet'
import { Message, PrivateKey } from 'bitcore-lib'
import { Chain } from '@metalet/utxo-wallet-service'

export async function process(message: string, encoding?: BufferEncoding): Promise<string> {
  const wallet = await getCurrentWallet(Chain.BTC)
  const privateKey = wallet.getPrivateKey()
  const signMessage = new Message(message)
  return signMessage.sign(new PrivateKey(privateKey))
}
