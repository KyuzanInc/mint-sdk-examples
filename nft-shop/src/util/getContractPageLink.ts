import { NetworkId } from '@kyuzan/mint-sdk-js'

export const getContractPageLink = (
  contractAddress: string,
  networkId: NetworkId
) => {
  if (networkId === 1) {
    return `https://etherscan.io/token/${contractAddress}`
  }

  if (networkId === 4) {
    return `https://rinkeby.etherscan.io/token/${contractAddress}`
  }

  if (networkId === 137) {
    return `https://explorer-mainnet.maticvigil.com/token/${contractAddress}`
  }

  if (networkId === 80001) {
    return `https://explorer-mumbai.maticvigil.com/token/${contractAddress}`
  }

  return ''
}
