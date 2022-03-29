import { Anchor, ScrollArea, Table } from '@mantine/core'
import React from 'react'

export interface TableNFTProps {
  data: {
    owner: string
    price: string
    timestamp: string
  }[]
}

const NFTSalesTable: React.FC<TableNFTProps> = ({ data }) => {
  const rows =
    data &&
    data.map((row) => {
      return (
        <tr key={row.owner}>
          <td>
            <Anchor<'a'> size='sm' onClick={(event) => event.preventDefault()}>
              {row.owner}
            </Anchor>
          </td>
          <td>
            <Anchor<'a'> size='sm' onClick={(event) => event.preventDefault()}>
              {row.price}
            </Anchor>
          </td>
          <td>{row.timestamp}</td>
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
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  )
}

export default NFTSalesTable
