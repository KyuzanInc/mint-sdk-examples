import { Item } from '@kyuzan/mint-sdk-js'
import React from 'react'
import {
  ListComponent,
  ListTitle,
  Title,
  CardUL,
  CardList,
  EmptyTitle,
} from '../../atoms/CardList'
import { Card } from '../../molecules/Card'

type Props = {
  items: Item[]
}

export const EndedAuctionList: React.FC<Props> = ({ items }) => {
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
