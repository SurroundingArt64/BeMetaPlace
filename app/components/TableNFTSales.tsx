import { Anchor, ScrollArea, Table } from '@mantine/core'
import React from 'react'

export interface TableNFTSalesProps {
  data: {
    owner: string
    address: string
    tokenId: string
    price: string
    timestamp: string
    type: string
  }[]
}

const TableNFTSales: React.FC<TableNFTSalesProps> = ({ data }) => {
  const rows =
    data &&
    data.map((row, index) => {
      const date = new Date(parseInt(row.timestamp, 10))
      const time = date.toLocaleTimeString() + ' ' + date.toLocaleDateString()
      return (
        <tr key={index}>
          <td>
            <Anchor<'a'> size='sm' onClick={(event) => event.preventDefault()}>
              {row.owner.substring(0, 6)}...
              {row.owner.substring(row.owner.length - 4)}
            </Anchor>
          </td>
          <td>
            <Anchor<'a'> size='sm' onClick={(event) => event.preventDefault()}>
              {row.price}
            </Anchor>
          </td>
          <td>{time}</td>
          <td>{row.type}</td>
        </tr>
      )
    })

  return (
    <ScrollArea style={{ width: '100%' }}>
      <Table verticalSpacing='xs'>
        <thead>
          <tr>
            <th>Owner</th>
            <th>Price</th>
            <th>Timestamp</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  )
}

export default TableNFTSales
