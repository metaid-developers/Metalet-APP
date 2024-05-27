import connector from '../connector'
import { getCurrentWallet } from '../wallet'
import { Chain } from '@metalet/utxo-wallet-service'

export async function process(_: unknown, host: string) {
  const wallet = await getCurrentWallet(Chain.MVC)
  const address = wallet.getAddress()

  // 检查连接状态
  if (!address) {
    return {
      status: 'error',
      message: 'no address',
    }
  }

  if (!connector.isConnected(address, host)) {
    return {
      status: 'error',
      message: 'not connected',
    }
  }

  return address
}
