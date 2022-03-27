import type { NextApiRequest, NextApiResponse } from 'next'

import { connectToDatabase } from '../../../lib/mongo'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return getNFTs(req, res)
    }
  }
}

async function getNFTs(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { params } = req.query
    const address = params[0]
    const tokenId = params[1]
    let { db } = await connectToDatabase()
    let nft = await db
      .collection('NFT')
      .find({ 'item.address': address, 'item.tokenId': tokenId })
      .sort({ published: -1 })
      .toArray()
    return res.json({
      message: JSON.parse(JSON.stringify(nft[0])),
      success: true,
    })
  } catch (error) {
    return res.json({
      message: new Error(error as string).message,
      success: false,
    })
  }
}
