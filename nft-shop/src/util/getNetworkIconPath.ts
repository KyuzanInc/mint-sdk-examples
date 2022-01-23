import { NetworkId } from '@kyuzan/mint-sdk-js'

export const getNetworkIconPath = (networkId: NetworkId | 'jpy') => {
  if (networkId === 'jpy') {
    return '/images/icons/yen.svg'
  }
  if (networkId === 1 || networkId === 4 || networkId === 31337) {
    return '/images/icons/network_eth.svg'
  }

  if (networkId === 80001 || networkId === 137) {
    return '/images/icons/network_polygon.svg'
  }

  throw new Error('Not implemented')
}
