import { Item } from '@kyuzan/mint-sdk-js'
import { PaginationMetadata } from '@kyuzan/mint-sdk-js/lib/apiClient'
import React from 'react'
import {
  ListComponent,
  ListTitle,
  Title,
  CardUL,
  CardList,
  EmptyTitle,
  Subtitle,
} from '../../atoms/CardList'
import { Card } from '../../molecules/Card'

type Props = {
  items: Item[]
  paginationMetadata: PaginationMetadata | null
}

export const EndedAuctionList: React.FC<Props> = ({ items, paginationMetadata }) => {
  if (items.length === 0) {
    return (
      <ListComponent>
        <ListTitle>
          <Title>終了した商品</Title>
        </ListTitle>
        <EmptyTitle>商品はありません</EmptyTitle>
      </ListComponent>
    )
  }
  return (
    <ListComponent>
      <ListTitle>
        <Title>終了した商品</Title>
        {paginationMetadata?.totalItems && (<Subtitle>Total item: {paginationMetadata?.totalItems}</Subtitle>)}
      </ListTitle>
      <CardUL>
        {items.map((item, i) => {
          return (
            <CardList key={i}>
              <Card item={item} loading={false} />
            </CardList>
          )
        })}
      </CardUL>
    </ListComponent>
  )
}
