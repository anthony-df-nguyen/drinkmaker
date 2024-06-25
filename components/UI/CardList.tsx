import React from 'react'

type Props = {
    items: {
        id: number,
        content: any,
    }[]
}

export default function CardList({items}: Props) {
  return (
    <ul role="list" className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="overflow-hidden rounded-md bg-white px-6 py-4 shadow">
          {item.content}
        </li>
      ))}
    </ul>
  )
}