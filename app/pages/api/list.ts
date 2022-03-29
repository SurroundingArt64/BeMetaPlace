import type { NextApiRequest, NextApiResponse } from 'next'
import { TableNFTSalesProps } from '../../components/TableNFTSales'

import { connectToDatabase } from '../../lib/mongo'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      return listNFT(req, res)
    }
  }
}

async function listNFT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedJSON = JSON.parse(req.body)

    /**
     * @dev ADD LISTING WEB3/BICO LOGIC HERE
     */

    const listing: TableNFTSalesProps['data'][0] = {
      owner: parsedJSON.owner as string,
      address: parsedJSON.item.address as string,
      tokenId: parsedJSON.item.tokenId as string,
      price: parsedJSON.sale.price,
      timestamp: new Date().getTime().toString(),
      type: 'SELL',
    }
    let { db } = await connectToDatabase()
    await db.collection('LISTINGS').insertOne(listing)
    return res.json({
      message: 'NFT added successfully',
      success: true,
    })
  } catch (error) {
    return res.json({
      message: new Error(error as string).message,
      success: false,
    })
  }
}
