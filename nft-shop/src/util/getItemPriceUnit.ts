import { Item, NetworkId } from '@kyuzan/mint-sdk-js'

export const getItemPriceUnit = (item: Item) => {
  return item.paymentMethodData.paymentMethod ===
    'credit-card-stripe-fixed-price'
    ? 'jpy'
    : getPriceUnit(item.paymentMethodData.contractDataERC721Shop.networkId)

}

export const getPriceUnit = (networkId: NetworkId | 'jpy') => {
  if (networkId === 'jpy') return 'YEN'

  if (networkId === 1 || networkId === 4 || networkId === 31337) {
    return 'ETH'
  }

  if (networkId === 80001 || networkId === 137) {
    return 'MATIC'
  }

  return ''
}
